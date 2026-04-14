import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { AdminGuard } from '../auth/auth.admin';

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');

function safePath(raw?: string): string {
  if (!raw) return '';
  const segments = raw
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);
  for (const s of segments) {
    if (!/^[a-zA-Z0-9_-]+$/.test(s)) {
      throw new BadRequestException(`Invalid folder segment: ${s}`);
    }
  }
  return segments.join('/');
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function isImage(name: string) {
  return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);
}

@Controller('uploads-api')
export class UploadsController {
  @Get()
  list(@Query('path') raw?: string) {
    const rel = safePath(raw);
    const abs = path.join(UPLOADS_DIR, rel);
    ensureDir(abs);

    const entries = fs.readdirSync(abs, { withFileTypes: true });

    const folders = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ name: e.name, path: rel ? `${rel}/${e.name}` : e.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const items = entries
      .filter((e) => e.isFile() && isImage(e.name))
      .map((e) => {
        const full = path.join(abs, e.name);
        const stat = fs.statSync(full);
        const relFile = rel ? `${rel}/${e.name}` : e.name;
        return {
          filename: e.name,
          path: relFile,
          url: `/uploads/${relFile}`,
          size: stat.size,
          mtime: stat.mtime.getTime(),
        };
      })
      .sort((a, b) => b.mtime - a.mtime);

    return { path: rel, folders, items };
  }

  @Post('folders')
  @UseGuards(AdminGuard)
  createFolder(@Body() body: { path?: string; name: string }) {
    if (!body?.name) throw new BadRequestException('name required');
    const parent = safePath(body.path);
    const name = safePath(body.name);
    if (!name || name.includes('/')) throw new BadRequestException('name must be a single segment');
    const rel = parent ? `${parent}/${name}` : name;
    const abs = path.join(UPLOADS_DIR, rel);
    if (fs.existsSync(abs)) throw new BadRequestException('folder already exists');
    fs.mkdirSync(abs, { recursive: true });
    return { ok: true, path: rel };
  }

  @Delete('folders')
  @UseGuards(AdminGuard)
  deleteFolder(@Query('path') raw?: string) {
    const rel = safePath(raw);
    if (!rel) throw new BadRequestException('path required');
    const abs = path.join(UPLOADS_DIR, rel);
    if (fs.existsSync(abs)) fs.rmSync(abs, { recursive: true, force: true });
    return { ok: true };
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Query('path') raw?: string) {
    if (!file) return { ok: false, error: 'no file' };
    const rel = safePath(raw);
    const absDir = path.join(UPLOADS_DIR, rel);
    ensureDir(absDir);

    const hash = crypto.createHash('sha256').update(`${Date.now()}-${Math.random()}`).digest('hex').slice(0, 14);
    const ext = path.extname(file.originalname) || '.bin';
    const clean = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);
    const filename = `${hash}-${clean}${ext}`;
    fs.writeFileSync(path.join(absDir, filename), file.buffer);
    const relFile = rel ? `${rel}/${filename}` : filename;
    return { ok: true, filename, path: relFile, url: `/uploads/${relFile}`, size: file.size };
  }

  @Delete()
  @UseGuards(AdminGuard)
  remove(@Query('path') raw?: string) {
    if (!raw) throw new BadRequestException('path required');
    const segs = raw.split('/').filter(Boolean);
    const filename = segs.pop()!;
    const dir = safePath(segs.join('/'));
    if (!/^[a-zA-Z0-9_.-]+$/.test(filename)) throw new BadRequestException('invalid filename');
    const abs = path.join(UPLOADS_DIR, dir, filename);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) fs.unlinkSync(abs);
    return { ok: true };
  }
}
