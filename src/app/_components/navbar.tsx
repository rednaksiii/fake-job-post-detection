import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

const contributors: { title: string; href: string; description: string }[] = [
  {
    title: "Ben Morin",
    href: "#",
    description:
      "I handled building the preprocessing pipeline and training the model.",
  },
  {
    title: "Khang Nguyen",
    href: "https://www.ndtkhang.dev",
    description:
      "I handled the full stack web app and integrating all services and POCs",
  },
  {
    title: "John Yoshida",
    href: "#",
    description:
      "I handled fetching, analyzing, and cleaning the dataset.",
  },
  {
    title: "Ishkandar",
    href: "#",
    description: "I handled deploying the ML with FastAPI.",
  },
  {
    title: "David Harrison",
    href: "#",
    description:
      "I researched evaluation metrics for our models and wrote the report.",
  },
  {
    title: "Jin Park",
    href: "#",
    description:
      "I made the POC for the LLM call to parse the the Job Description for our ML Model.",
  },
]

export function NavBar() {
    return (
        <NavigationMenu>
        <NavigationMenuList>

          {/* Home Page */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/">Detector</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Contributors */}
          <NavigationMenuItem>
          <NavigationMenuTrigger>Contributors</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {contributors.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

          {/* Github Link */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="https://github.com/ndtkhang/fake_job_post_detective">Github</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
}