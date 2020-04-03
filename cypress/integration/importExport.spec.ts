describe("import/export", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("simple dig", () => {
    it("imports and shows the correct export value", () => {
      const template = "#dig\nd,d,d\nd,d,d";
      cy.findByText("Import").click();
      cy.findByLabelText("dig").type(template);
      cy.findByText("Import All").click();
      cy.findByText("Export").click();
      cy.findByLabelText("dig").should("have.value", template);
    });
  });

  describe("multi-phase", () => {
    it("imports and shows the correct export value", () => {
      const digTemplate = "#dig\nd,d,d\nd,d,d\nd,d,d";
      const buildTemplate = "#build\n~,b,~";
      cy.findByText("Import").click();
      cy.findByLabelText("dig").type(digTemplate);
      cy.findByLabelText("build").type(buildTemplate);
      cy.findByText("Import All").click();
      cy.findByText("Export").click();
      cy.findByLabelText("dig").should("have.value", digTemplate);
      cy.findByLabelText("build").should(
        "have.value",
        "#build\n~,b,~\n~,~,~\n~,~,~",
      );
    });
  });

  describe("adjustments", () => {
    it("imports and shows the correct export value", () => {
      const digTemplate = "#dig\nd,d,d\nd,d,d\nd,d,d";
      const buildTemplate = "#build\n~,b,~";
      const queryTemplate = "#query\n~,r++,~";
      cy.findByText("Import").click();
      cy.findByLabelText("dig").type(digTemplate, {
        delay: 0,
      });
      cy.findByLabelText("build").type(buildTemplate, {
        delay: 0,
      });
      cy.findByLabelText("query").type(queryTemplate, {
        delay: 0,
      });
      cy.findByText("Import All").click();
      cy.findByText("Export").click();
      cy.findByLabelText("dig").should("have.value", digTemplate);
      cy.findByLabelText("build").should(
        "have.value",
        "#build\n~,b,~\n~,~,~\n~,~,~",
      );
      cy.findByLabelText("query").should(
        "have.value",
        "#query\n~,r++,~\n~,~,~\n~,~,~",
      );
    });
  });

  describe("bad imports", () => {
    it("skips invalid tiles", () => {
      const digTemplate = "#dig\nf,d,d,d,~,~";
      const buildTemplate = "#build\n~,b,J,b,~,b";
      const queryTemplate = "#query\n~,f--,~,r++,x--,~";
      cy.findByText("Import").click();
      cy.findByLabelText("dig").type(digTemplate, {
        delay: 0,
      });
      cy.findByLabelText("build").type(buildTemplate, {
        delay: 0,
      });
      cy.findByLabelText("query").type(queryTemplate, {
        delay: 0,
      });
      cy.findByText("Import All").click();
      cy.findByText("Export").click();
      cy.findByLabelText("dig").should("have.value", "#dig\nd,d,d");
      cy.findByLabelText("build").should("have.value", "#build\nb,~,b");
      cy.findByLabelText("query").should("have.value", "#query\n~,~,r++");
    });
  });
});
