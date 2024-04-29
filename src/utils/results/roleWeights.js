const roleWeights = {
  instructor: {
    peer: 0.15,
    head: 0.35,
    student: 0.5,
  },
  head: {
    dean: 0.35,
    peer: 0.15,
    student: 0.5,
  },
  teamLeader: {
    director: 0.13,
    peer: 0.12,
    self: 0.1,
  },
  director: {
    student: 0.5,
    head: 0.35,
    peer: 0.15,
  },
  dean: {
    student: 0.5,
    peer: 0.15,
    head: 0.35,
  },
  adminstrative: {
    self: 0.1,
    teamLeader: 0.13,
    peer: 0.12,
  },
  other: {
    peer: 0.15,
    head: 0.35,
  },
};

export default roleWeights;
