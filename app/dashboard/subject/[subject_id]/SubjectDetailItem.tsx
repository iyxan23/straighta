import { CustomCard } from "@/components";

interface SubjectDetailItemProps {
  title: string;
}

export default function SubjectDetailItem({ title }: SubjectDetailItemProps) {
  return (
    <CustomCard className="">
      <hgroup className="inline-flex items-center justify-between w-full p-4 group-hover:border-b border-slate-200">
        <h4 className="text-xl font-semibold text-slate-700">{title}</h4>
        <div className="ml-auto flex w-fit h-8 items-center">
          <hr className="w-2 h-[2px] border-none bg-slate-700 rotate-45 -mr-[1.5px] group-hover:-rotate-45 transition"></hr>
          <hr className="w-2 h-[2px] border-none bg-slate-700 -rotate-45 -ml-[1.5px] group-hover:rotate-45 transition"></hr>
        </div>
      </hgroup>
      <main className="group-hover:block hidden p-4">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Harum unde
        eveniet qui, atque minima tempore id nemo repellat vitae molestiae sint,
        eum et recusandae laboriosam quo doloremque, illum in optio iure? Et?
      </main>
    </CustomCard>
  );
}
