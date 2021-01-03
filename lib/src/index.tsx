import * as React from "react";
import {
  AccessibilityChangeEventName,
  AccessibilityInfo,
  Dimensions,
  Platform,
  PlatformOSType,
  ScaledSize,
  useColorScheme,
  ViewStyle,
} from "react-native";

type ISelector = PlatformOSType | IOrientation | "light" | "dark" | A11yTrait;

type IStyles = Partial<Record<ISelector, ViewStyle>>;

function useStyleSelectors(style: IStyles, ...additionalStyles: ViewStyle[]) {
  const platformStyles = usePlatformStyle(style);
  const colorSchemeStyles = useColorSchemeStyle(style);
  const orientationStyles = useOrientationStyle(style);
  const a11yStyles = useA11yStyle(style);

  return [
    platformStyles,
    colorSchemeStyles,
    orientationStyles,
    a11yStyles,
    ...(additionalStyles || []),
  ];
}

function usePlatformStyle(style: IStyles) {
  return Platform.select(style);
}

function useColorSchemeStyle(style: IStyles) {
  const colorScheme = useColorScheme();
  return colorScheme && style[colorScheme];
}

function useOrientationStyle(style: IStyles) {
  const orientation = useDeviceOrientation();
  return style[orientation];
}

function useA11yStyle(style: IStyles) {
  const assembledStyles = {};
  const a11yTraits = useAccessibilityInfo();

  Object.keys(style).forEach((key: A11yTrait) => {
    if (a11yTraits[key]) {
      Object.assign(assembledStyles, style[key]);
    }
  });

  return assembledStyles;
}

type IOrientation = "portrait" | "landscape";

function isPortrait(height: number, width: number) {
  return height >= width;
}

function useDeviceOrientation() {
  const [orientation, setOrientation] = React.useState<IOrientation>(() => {
    const { width, height } = Dimensions.get("screen");
    return isPortrait(height, width) ? "portrait" : "landscape";
  });

  React.useEffect(() => {
    function onChange({ screen }: { screen: ScaledSize }) {
      const orientation = isPortrait(screen.height, screen.width)
        ? "portrait"
        : "landscape";
      setOrientation(orientation);
    }

    Dimensions.addEventListener("change", onChange);

    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  return orientation;
}

type A11yTrait =
  | "boldtext"
  | "grayscale"
  | "invert-colors"
  | "reduce-motion"
  | "transparency"
  | "screenreader";

type AccessibilityInfoStaticInitializers =
  | "isBoldTextEnabled"
  | "isScreenReaderEnabled"
  | "isGrayscaleEnabled"
  | "isInvertColorsEnabled"
  | "isReduceMotionEnabled"
  | "isReduceTransparencyEnabled";

function useAccessibilityStateListener(
  eventName: AccessibilityChangeEventName,
  initializerName: AccessibilityInfoStaticInitializers
) {
  const [isEnabled, setIsEnabled] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (!AccessibilityInfo[initializerName]) {
      return;
    }

    AccessibilityInfo[initializerName]().then(setIsEnabled);
    AccessibilityInfo.addEventListener(eventName, setIsEnabled);

    return () => AccessibilityInfo.removeEventListener(eventName, setIsEnabled);
  }, [eventName, initializerName]);

  return isEnabled;
}

function useAccessibilityInfo(): Record<A11yTrait, boolean | undefined> {
  const boldTextEnabled = useAccessibilityStateListener(
    "boldTextChanged",
    "isBoldTextEnabled"
  );
  const grayscaleEnabled = useAccessibilityStateListener(
    "grayscaleChanged",
    "isGrayscaleEnabled"
  );
  const invertColorsEnabled = useAccessibilityStateListener(
    "invertColorsChanged",
    "isInvertColorsEnabled"
  );
  const reduceMotionEnabled = useAccessibilityStateListener(
    "reduceMotionChanged",
    "isReduceMotionEnabled"
  );
  const reduceTransparencyEnabled = useAccessibilityStateListener(
    "reduceTransparencyChanged",
    "isReduceTransparencyEnabled"
  );
  const screenReaderEnabled = useAccessibilityStateListener(
    "screenReaderChanged",
    "isScreenReaderEnabled"
  );

  return {
    ["screenreader"]: screenReaderEnabled,
    ["grayscale"]: grayscaleEnabled,
    ["invert-colors"]: invertColorsEnabled,
    ["reduce-motion"]: reduceMotionEnabled,
    ["transparency"]: reduceTransparencyEnabled,
    ["boldtext"]: boldTextEnabled,
  };
}

export { useStyleSelectors };
