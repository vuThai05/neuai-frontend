import Image from "next/image"

interface AskneuLogoProps {
  className?: string
  size?: number
}

export function AskneuLogo({ className, size = 32 }: AskneuLogoProps) {
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
