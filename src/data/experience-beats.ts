export type Beat = { title: string; action: string; summary: string };
export type Kind = "ethanol" | "land" | "research";

export const beats: Record<Kind, Beat[]> = {
  ethanol: [
    { title: "Overview", action: "One plant, three workstreams.", summary: "I coordinated civil works, mechanical installation and statutory clearances for an ethanol facility." },
    { title: "Civil works", action: "Prepare the site for installation.", summary: "I tracked foundation and site readiness so equipment teams could see what needed to be ready before installation." },
    { title: "Mechanical", action: "Sequence equipment and handoffs.", summary: "I coordinated vendors and site teams around equipment delivery, installation and interfaces." },
    { title: "Clearances", action: "Track what still needed review.", summary: "I kept documentation, clearance requirements and follow-up visible alongside the work they affected." },
    { title: "Integration", action: "Bring readiness into view.", summary: "I tracked progress and open dependencies across the three workstreams to support commissioning readiness." },
  ],
  land: [
    { title: "Records", action: "Trace the ownership record.", summary: "I organized ownership, revenue and encumbrance records so missing evidence could be followed up." },
    { title: "Field & GIS", action: "Compare records with the site.", summary: "Field surveys and GIS observations gave the team a second view of boundaries, access and usable land." },
    { title: "Specialists", action: "Connect the verification work.", summary: "I coordinated documentary, field, GIS and legal work so specialists could review their findings together." },
    { title: "Report", action: "Make the next action clear.", summary: "I brought the findings, supporting evidence and outstanding questions into a structured property report." },
  ],
  research: [
    { title: "Scope", action: "Start with the constituency.", summary: "I researched 15 constituencies during the 2023 Telangana Assembly elections." },
    { title: "Sources", action: "Gather different perspectives.", summary: "I brought together constituency research, field and community observations, and policy and media sources." },
    { title: "Synthesis", action: "Build a briefing point.", summary: "I organized the material into a question, the evidence behind it, and the implication for leadership." },
    { title: "Brief", action: "Prepare leadership for the conversation.", summary: "I prepared briefing notes for ministers and MLCs that supported debate preparation, media messaging and campaign narratives." },
  ],
};

export const nominationBeats: Beat[] = [
  { title: "Material", action: "Gather the public record.", summary: "I brought profile material, professional experience and supporting records together." },
  { title: "Structure", action: "Build a navigable document.", summary: "I organized the material into a coherent contents structure and thematic sections." },
  { title: "Portfolio", action: "Prepare the formal submission.", summary: "I prepared the portfolio sent to the Legislative Council for nomination and approval proceedings." },
];
