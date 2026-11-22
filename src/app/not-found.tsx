import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center bg-cream-2 px-5 pt-[84px] text-center">
      <div>
        <p className="font-display text-[120px] font-medium leading-none text-brand">404</p>
        <h1 className="mt-4 font-display text-[36px] font-medium text-navy">This page took a wrong turn.</h1>
        <p className="mt-3 text-body">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/contact" variant="outline">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
