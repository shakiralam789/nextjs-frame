import { generateMetadata } from '@/utilities/metaData';
export const metadata = () => generateMetadata({ title: "Update User" });
export default function layout({children}) {
  return (
    <>
        {children}
    </>
  )
}
