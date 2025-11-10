import Image from "next/image";
import MySelect from "@/components/MySelect";
import MultipleSelectPlaceholder from "@/components/MultipleSelectPlaceholder";
import PaginaPrincipal from "@/components/PaginaPrincipal";


// const frutas = ["Manzana", "Pera", "Banana", "Uva", "Naranja"];
// const personas = ["Juan", "María", "Pedro", "Lucía"];

  {/* <MySelect />
<MultipleSelectPlaceholder
  names={personas}
  placeholder="Selecciona personas"
/> */}
{/* <a
  className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  target="_blank"
  rel="noopener noreferrer"
>
  Documentation
</a> */}

export default function Home() {
  return (
    <div>
      <PaginaPrincipal /> 
    </div>          
  );
}
