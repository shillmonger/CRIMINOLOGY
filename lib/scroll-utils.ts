import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type CloseMenuFunction = (() => void) | undefined

export const handleNavigationWithScroll = (
  currentPath: string,
  targetPath: string,
  sectionId: string,
  router: AppRouterInstance,
  closeMenu?: CloseMenuFunction
) => {
  // If we're already on the target page, just scroll to the section
  if (currentPath === targetPath) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    // If we need to navigate to a different page first
    router.push(`${targetPath}#${sectionId}`)
  }
  
  // Close mobile menu if open
  if (closeMenu) {
    closeMenu()
  }
}
