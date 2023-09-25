import { subjectListGetRequest } from "@/app/api/schema";
import { headers } from "next/headers";

export default async function SubjectItemMaterials({
  subjectId,
}: {
  subjectId: number;
}): Promise<JSX.Element> {
  // const headersList = headers();
  // const host = headersList.get("host");
  // if (!host) {
  //   throw new Error("no host header");
  // }

  // fetch(`${host}/api/subject/list`, {
  //   method: "GET",
  //   body: JSON.stringify(
  //     await subjectListGetRequest.parseAsync({
  //       limit: 10,
  //       offset: 0,
  //     })
  //   ),
  // });
  return <>{subjectId}</>;
}
