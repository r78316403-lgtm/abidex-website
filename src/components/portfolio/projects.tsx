"use client";

// =====================================================================
// PROJECTS — premium project showcase with case-study modal
// =====================================================================

import { useState } from "react";
import { Section, Eyebrow, Heading, Lead } from "@/components/portfolio/ui-helpers";
import { Button } from "@/components/ui/button";
import { projects, type Project } from "@/lib/abidex-data";
import { ArrowUpRight, X, CheckCircle2, Workflow, Cpu, Target, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <Section id="projects" className="bg-secondary/10">
      <div className="text-center mb-12 md:mb-16">
        <Eyebrow>Featured Projects</Eyebrow>
        <Heading className="mx-auto">
          Demo Projects &amp; <span className="text-gradient">Concept Builds</span>
        </Heading>
        <Lead className="mx-auto text-center">
          Realistic demonstrations of the systems I can build. Every project below is a
          concept — labelled honestly as a demo — showing the kind of work I do.
        </Lead>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => setActive(p)} />
        ))}
      </div>

      {/* Case study modal */}
      {active && <CaseStudyModal project={active} onClose={() => setActive(null)} />}
    </Section>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative text-left rounded-2xl border border-border bg-card overflow-hidden glow-border h-full flex flex-col"
    >
      {/* Visual header */}
      <div className={cn("relative aspect-[16/9] bg-gradient-to-br overflow-hidden", project.accent)}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Workflow className="h-16 w-16 text-foreground/30 group-hover:scale-110 group-hover:text-foreground/50 transition-all" />
        </div>
        {/* Demo badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur border border-border text-foreground">
          {project.demo ? "Demo Project" : "Concept Project"}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-medium bg-background/80 backdrop-blur border border-border text-muted-foreground">
          {project.category.split("•")[0].trim()}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-xs text-primary font-medium mb-2">{project.category}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary border border-border text-muted-foreground"
            >
              {t}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-muted-foreground">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          View Case Study
          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </button>
  );
}

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto abidex-scroll rounded-2xl border border-border bg-card animate-scale-in"
      >
        {/* Header with gradient */}
        <div className={cn("relative aspect-[21/9] bg-gradient-to-br", project.accent)}>
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Workflow className="h-20 w-20 text-foreground/30" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-background/80 backdrop-blur border border-border hover:bg-secondary transition-colors"
            aria-label="Close case study"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute top-4 left-4 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur border border-border">
            {project.demo ? "Demo Project" : "Concept Project"}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-2">
            {project.category}
          </p>
          <h2 id="case-study-title" className="text-2xl md:text-3xl font-bold mb-3">
            {project.name}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Sections */}
          <div className="space-y-6">
            <CaseSection icon={Target} label="Problem" body={project.problem} />
            <CaseSection icon={CheckCircle2} label="Solution" body={project.solution} />

            {/* Workflow */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Workflow className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Workflow
                </h3>
              </div>
              <ol className="space-y-2">
                {project.workflow.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-muted-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <CaseSection icon={Cpu} label="Technology" body={project.techStack.join(" • ")} />
            <CaseSection icon={Wrench} label="Expected / Intended Outcome" body={project.outcome} />
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                onClose();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Discuss a Similar Project
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseSection({
  icon: Icon,
  label,
  body,
}: {
  icon: any;
  label: string;
  body: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </h3>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed pl-6">{body}</p>
    </div>
  );
}
