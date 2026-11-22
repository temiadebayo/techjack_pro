import type { StructureResolver } from "sanity/structure";

const SINGLETON_IDS = new Set(["siteSettings", "artistProfile"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Tech Jack® / 7926")
    .items([
      // Global singletons
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),
      S.listItem()
        .title("The Persona (Artist Profile)")
        .id("artistProfile")
        .child(
          S.document()
            .schemaType("artistProfile")
            .documentId("artistProfile")
            .title("The Persona")
        ),
      S.divider(),

      // Music & Moving Image
      S.documentTypeListItem("release").title("The Archive (Releases)"),
      S.documentTypeListItem("visualWork").title("The Visuals"),
      S.divider(),

      // Living World
      S.documentTypeListItem("fragment").title("Fragments (Living Diary)"),
      S.documentTypeListItem("chapter").title("Chapters"),
      S.divider(),

      // Uniform & Dispatches
      S.documentTypeListItem("product").title("The Uniform (Merchandise)"),
      S.documentTypeListItem("announcement").title("Announcements / Signal"),
      S.divider(),

      // Segregated Internal / Restricted Vault
      S.listItem()
        .title("Restricted Vault (Never Public)")
        .child(
          S.documentList()
            .title("Restricted / Unpublished Documents")
            .filter('status == "restricted"')
        ),

      ...S.documentTypeListItems().filter(
        (item) =>
          !SINGLETON_IDS.has(item.getId() || "") &&
          ![
            "release",
            "visualWork",
            "fragment",
            "chapter",
            "product",
            "announcement",
          ].includes(item.getId() || "")
      ),
    ]);
