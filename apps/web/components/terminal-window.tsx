import dynamic from "next/dynamic";

const Terminal = dynamic(() => import("./terminal"), {
  ssr: false,
});

const TerminalWindow = () => (
  <div className={"w-full h-96 max-h-full mt-8"}>
    <Terminal />
  </div>
);

export default TerminalWindow;
