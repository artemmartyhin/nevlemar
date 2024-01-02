import * as React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Placeholder for the icon

// Define the props type, extending from MUI ButtonProps
interface CustomButtonProps extends ButtonProps {
  buttonType: "active" | "default" | "outline" | "focus" | "hover" | "disabled";
  backgroundColor?: string;
  textColor?: string;
  iconLeft?: boolean;
  iconRight?: boolean;
  iconOnly?: boolean;
  text?: string;
  onClick?: () => void;
}

// Styled component using MUI's 'styled' utility
const CustomButton = styled(Button)<CustomButtonProps>(
  ({ theme, buttonType, iconOnly, backgroundColor, textColor }) => ({
    color: !textColor ? "#ffffff" : textColor,
    borderRadius: 57,
    justifyContent: "center",
    display: "inline-flex",
    gap: theme.spacing(iconOnly ? 1.5 : 2),
    padding: iconOnly ? theme.spacing(1.5) : theme.spacing(1.75, 3.5, 1.25),
    width: iconOnly ? theme.spacing(6) : theme.spacing(25.25),
    ...theme.typography.button,
    backgroundColor: buttonType === "default" ? backgroundColor : "transparent",
    "&:hover": {
      backgroundColor: buttonType === "hover" ? "#005f73" : "transparent",
    },
    "&.Mui-disabled": {
      backgroundColor: buttonType === "disabled" ? "#667479" : "transparent",
      color: buttonType === "disabled" ? "rgba(255, 255, 255, 0.5)" : "inherit",
    },
    border: buttonType === "outline" ? "1.5px solid #003459" : "none",
    borderColor: buttonType === "focus" ? "#005f73" : "transparent",
    font: "normal normal bold 16px/24px Rosario",
  })
);

// The ButtonL component with proper TypeScript typings
export const ButtonL: React.FC<CustomButtonProps> = ({
  buttonType,
  backgroundColor,
  textColor,
  iconLeft,
  iconRight,
  iconOnly,
  onClick,
  ...props
}) => {
  return (
    <CustomButton
      backgroundColor={backgroundColor}
      textColor={textColor}
      buttonType={buttonType}
      iconLeft={iconLeft}
      iconRight={iconRight}
      iconOnly={iconOnly}
      disabled={buttonType === "disabled"}
      startIcon={iconLeft && !iconOnly ? <ArrowForwardIosIcon /> : null}
      endIcon={iconRight && !iconOnly ? <ArrowForwardIosIcon /> : null}
      onClick={onClick}
      {...props} // Spread the rest of the props to the Button component
    >
      {!iconOnly ? props.text : null}
    </CustomButton>
  );
};
