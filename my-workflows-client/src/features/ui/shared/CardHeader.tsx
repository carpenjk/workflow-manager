import { twMerge } from "tailwind-merge"

interface Props extends React.ComponentProps<'h1'> {}

const CardHeader = ({children, className, ...props}:Props) => {
  return ( 
    <h1 {...props} className={twMerge("w-full text-lg xl:text-2xl text-text-normal dark:text-dk-text-normal font-maven font-bold mb-4 xl:mb-6 ", className)}>
      {children}
    </h1> );
}
 
export default CardHeader;