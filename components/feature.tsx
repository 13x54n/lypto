interface Feature {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
  }
  
  interface FeatureProps {
    heading?: string;
    features?: Feature[];
  }
  
  const Feature = ({
    heading = "Why Choose Zypto? 🤔",
    features = [
      {
        id: "feature-1",
        title: "Stable Value Protection",
        subtitle: "STABLE VALUE",
        description:
          "Your loyalty points maintain their value over time, just like stablecoins. No more worrying about inflation or point devaluation.",
        image: "https://images.unsplash.com/photo-1612012060851-20f943c02d3d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        id: "feature-2",
        title: "Universal Spending Power",
        subtitle: "SPEND ANYWHERE",
        description:
          "Use your points at any merchant that accepts digital payments. No more being locked into specific stores or loyalty programs.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }
    ],
  }: FeatureProps) => {
    return (
      <section className="">
        <div className="container max-w-7xl">
          <h2 className="text-3xl font-bold lg:text-4xl">{heading}</h2>
          <div className="mt-12 grid gap-9 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col justify-between rounded-lg bg-accent"
              >
                <div className="flex justify-between gap-10 border-b">
                  <div className="flex flex-col justify-between gap-14 py-6 pl-4 md:py-10 md:pl-8 lg:justify-normal">
                    <p className="text-xs text-muted-foreground">
                      {feature.subtitle}
                    </p>
                    <h3 className="text-2xl md:text-4xl">{feature.title}</h3>
                  </div>
                  <div className="md:1/3 w-2/5 shrink-0 rounded-r-lg border-l">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-4 text-muted-foreground md:p-8">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export { Feature };
  