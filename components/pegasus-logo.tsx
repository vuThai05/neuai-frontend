import Image from "next/image"

interface PegasusLogoProps {
  className?: string
  size?: number
}

export function PegasusLogo({ className, size = 32 }: PegasusLogoProps) {
  return (
    <Image
      src="https://nguoihoc.neu.edu.vn/static/media/logo_footer.f3b0caed.png"
      alt="NEU Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
