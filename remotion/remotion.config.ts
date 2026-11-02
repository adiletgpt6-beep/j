import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setBrowserExecutable("/opt/pw-browsers/chromium-1243/chrome-linux64/chrome");
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(4);
