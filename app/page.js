import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <p className="text-lg">This is a test</p>
      <button className="bg-blue-500 text-white p-2 rounded-md">Click me</button>
    </div>
  );
}
