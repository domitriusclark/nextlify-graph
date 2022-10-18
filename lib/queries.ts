export const fetchReposQuery = `
  query {
    gitHub {
      repositoryOwner(login: "domitriusclark") {
        repositories(last: 10) {
          nodes {
            id
            name
            description
          }
        }
      }
    }
  }
`;
