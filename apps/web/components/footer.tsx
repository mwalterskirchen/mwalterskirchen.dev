import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 flex items-center justify-between py-2 px-8">
      <Link href={"/imprint"}>Imprint</Link>
      <div className={"flex items-center justify-center gap-5"}>
        <span>Made with ❤️ by Maximilian Walterskirchen</span>
        <span>
          <a href="https://github.com/mwalterskirchen" target="_blank">
            <Image
              src={"/github.svg"}
              height={18}
              width={18}
              alt="@mwalterskirchen GitHub Profile"
            />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/mwalterskirchen/"
            target="_blank"
          >
            <Image
              src={"/linkedin.svg"}
              height={18}
              width={18}
              alt="@mwalterskirchen LinkedIn Profile"
            />
          </a>
        </span>
      </div>
      <Link href={"/privacy"}>Data Privacy</Link>
    </footer>
  );
};
