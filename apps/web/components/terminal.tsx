"use client";
import React from "react";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";

function Terminal() {
  const commands = {
    help: (
      <span>
        <strong className={"text-teal-400"}>clear</strong> - clears the console.{" "}
        <br />
      </span>
    ),
  };

  const welcomeMessage = (
    <span>
      Type <strong className={"text-teal-400"}>help</strong> for all available
      commands. <br />
    </span>
  );

  const defaultHandler = (command: string, commandArguments: string) => {
    return `${command} passed on to default handler with arguments ${commandArguments}`;
  };

  return (
    <TerminalContextProvider>
      <ReactTerminal
        prompt={"$ >"}
        themes={{
          maxTheme: {
            themeBGColor: "#1f2937",
            themeToolbarColor: "#1f2937",
            themeColor: "#FFFEFC",
            themePromptColor: "#2DD4BF",
          },
        }}
        theme="maxTheme"
        showControlBar
        showControlButtons
        welcomeMessage={welcomeMessage}
        commands={commands}
        defaultHandler={defaultHandler}
      />
    </TerminalContextProvider>
  );
}

export default Terminal;
