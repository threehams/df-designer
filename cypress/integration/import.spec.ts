describe("import/export", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3000");
  });

  describe("simple dig", function() {
    it("imports and shows the correct export value", function() {
      const template = "#dig\nd,d,d\nd,d,d";
      cy.getId("import").click();
      cy.getId("import-text-dig").type(template);
      cy.getId("import-all").click();
      cy.getId("export").click();
      cy.getId("export-text-dig").should("have.value", template);
    });
  });

  describe("multi-phase", function() {
    it("imports and shows the correct export value", function() {
      const digTemplate = "#dig\nd,d,d\nd,d,d\nd,d,d";
      const buildTemplate = "#build\n`,b,`";
      cy.getId("import").click();
      cy.getId("import-text-dig").type(digTemplate);
      cy.getId("import-text-build").type(buildTemplate);
      cy.getId("import-all").click();
      cy.getId("export").click();
      cy.getId("export-text-dig").should("have.value", digTemplate);
      cy.getId("export-text-build").should(
        "have.value",
        "#build\n`,b,`\n`,`,`\n`,`,`",
      );
    });
  });

  describe("adjustments", function() {
    it("imports and shows the correct export value", function() {
      const digTemplate = "#dig\nd,d,d\nd,d,d\nd,d,d";
      const buildTemplate = "#build\n`,b,`";
      const queryTemplate = "#query\n`,r,`";
      cy.getId("import").click();
      cy.getId("import-text-dig").type(digTemplate, { delay: 0 });
      cy.getId("import-text-build").type(buildTemplate, { delay: 0 });
      cy.getId("import-text-query").type(queryTemplate, { delay: 0 });
      cy.getId("import-all").click();
      cy.getId("export").click();
      cy.getId("export-text-dig").should("have.value", digTemplate);
      cy.getId("export-text-build").should(
        "have.value",
        "#build\n`,b,`\n`,`,`\n`,`,`",
      );
      cy.getId("export-text-query").should(
        "have.value",
        "#query\n`,r,`\n`,`,`\n`,`,`",
      );
    });
  });
});
