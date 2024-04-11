export const roleMappings = {
  teamLeader: ["director", "peer", "self"],
  head: ["dean", "peer", "student"],
  dean: ["student", "peer", "head"],
  instructor: ["student", "peer", "head"],
  academic: ["peer", "head", "student"],
  administrative: ["self", "peer", "teamLeader"],
  other: ["peer", "head"],
  director: ["head", "student", "peer"],
};
