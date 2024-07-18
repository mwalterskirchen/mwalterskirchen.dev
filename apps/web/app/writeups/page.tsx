import Link from "next/link";
import { format } from "date-fns";
import API from "../../util/api-utils";

const getAllWriteups = async () => {
  const res = await API.get("/posts");
  return res.docs;
};

export default async function Page() {
  const writeups = await getAllWriteups();
  return (
    <main className="h-full flex items-center flex-col">
      <h1>Writeups</h1>
      {writeups.map((writeup: any) => (
        <WriteUpCard key={writeup.id} writeup={writeup} />
      ))}
    </main>
  );
}

const WriteUpCard = ({ writeup }: { writeup: any }) => {
  const date = format(writeup.createdAt, "LLLL d, yyyy");
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={`/writeups/${writeup.id}`}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {writeup.title}
        </Link>
      </h2>
      <time dateTime={date} className="mb-2 block text-xs text-gray-600">
        {date}
      </time>
    </div>
  );
};
