// Sample data for the prototype. Everything here is invented:
// the college, the people, the activities and the organizations.
window.WP_DATA = {
  appName: 'Waypoint', // placeholder name: change it here
  college: 'Northfield College',
  staff: { name: 'Dana Whitlock', unit: 'Student Life' },
  me: { id: 'me', name: 'Riley Okafor', program: 'B.Sc. Environmental Science', year: 'Second year', initials: 'RO' },

  // Student levels, by total points.
  levels: [
    { n: 1, name: 'Starter', min: 0 },
    { n: 2, name: 'Explorer', min: 100 },
    { n: 3, name: 'Builder', min: 250 },
    { n: 4, name: 'Leader', min: 500 },
    { n: 5, name: 'Trailblazer', min: 900 },
  ],

  competencies: [
    { id: 'comm', name: 'Communication', color: '#2f7f79' },
    { id: 'team', name: 'Teamwork', color: '#c9822b' },
    { id: 'lead', name: 'Leadership', color: '#8a5fb5' },
    { id: 'crit', name: 'Critical thinking', color: '#3d74b8' },
    { id: 'comm2', name: 'Community', color: '#b8574f' },
    { id: 'career', name: 'Career readiness', color: '#5d8a3a' },
  ],

  // depth 1 = show up, 2 = take part, 3 = contribute, 4 = lead
  depths: { 1: 'Show up', 2: 'Take part', 3: 'Contribute', 4: 'Lead' },
  depthPoints: { 1: 10, 2: 25, 3: 50, 4: 100 }, // default points for a new activity at each depth

  activities: [
    { id: 'a1', type: 'event', title: 'Résumé clinic drop-in', host: 'Career Centre', depth: 1, points: 10,
      comps: ['career', 'comm'], when: 'Today, 3:00 – 5:00 pm', where: 'Library, room 204', window: 'open', code: 'PINE-204',
      blurb: 'Bring a draft and get ten minutes with a career adviser. No booking needed.' },
    { id: 'a2', type: 'event', title: 'River clean-up morning', host: 'Green Campus Society', depth: 2, points: 25,
      comps: ['comm2', 'team'], when: 'Today, 9:00 am – 12:00 pm', where: 'Meet at the boathouse', window: 'open', code: 'HERON-9',
      blurb: 'Gloves and bags supplied. Wear boots. Counts toward the Good Neighbour badge.' },
    { id: 'a3', type: 'event', title: 'Debate night: is growth green?', host: 'Debate Union', depth: 1, points: 10,
      comps: ['crit', 'comm'], when: 'Thu, 6:30 pm', where: 'Hale Hall', window: 'upcoming', code: 'ASPEN-63',
      blurb: 'Two teams, one motion, audience vote. Come to listen or sign up to speak from the floor.' },
    { id: 'a4', type: 'event', title: 'Employer panel: environmental careers', host: 'Career Centre', depth: 1, points: 10,
      comps: ['career'], when: 'Next Tue, 12:00 pm', where: 'Online', window: 'upcoming', code: 'CEDAR-12',
      blurb: 'Four graduates talk about their first two years in work. Questions welcome.' },
    { id: 'a5', type: 'event', title: 'Welcome week volunteer briefing', host: 'Student Life', depth: 1, points: 10,
      comps: ['team'], when: 'Last Mon, 4:00 pm', where: 'Union atrium', window: 'closed', code: 'ELM-4',
      blurb: 'Briefing for welcome week volunteers.' },
    { id: 'a6', type: 'task', title: 'Informational interview', host: 'Career Centre', depth: 2, points: 25,
      comps: ['career', 'comm'], proof: 'reflection', approval: true, minWords: 40,
      blurb: 'Talk to someone doing a job you are curious about for 20 minutes. Then write what surprised you and what you will do next.' },
    { id: 'a7', type: 'task', title: 'Lead a study group for four weeks', host: 'Learning Commons', depth: 4, points: 100,
      comps: ['lead', 'team'], proof: 'reflection', approval: true, minWords: 60,
      blurb: 'Organise and run a weekly study group. Reflect on what you changed after week one.' },
    { id: 'a8', type: 'task', title: 'Write for the campus paper', host: 'The Campus Post', depth: 3, points: 50,
      comps: ['comm', 'crit'], proof: 'file', approval: true,
      blurb: 'Publish one article of 600 words or more. Upload the published piece or a link saved as a PDF.' },
    { id: 'a9', type: 'task', title: 'Budget your term', host: 'Money Advice', depth: 1, points: 10,
      comps: ['crit'], proof: 'reflection', approval: false, minWords: 20,
      blurb: 'Use the term budget sheet, then note one thing you will change. Credit is given as soon as you submit.' },
    { id: 'a10', type: 'task', title: 'Mentor a first-year student', host: 'Peer Mentoring', depth: 4, points: 100,
      comps: ['lead', 'comm2'], proof: 'reflection', approval: true, minWords: 60,
      blurb: 'Meet your mentee at least four times this term. Reflect on one conversation that went differently than planned.' },
    { id: 'a11', type: 'task', title: 'Present at the undergraduate showcase', host: 'Research Office', depth: 3, points: 50,
      comps: ['comm', 'crit'], proof: 'file', approval: true,
      blurb: 'Present a poster or a five-minute talk. Upload your poster or slides.' },
    { id: 'a12', type: 'task', title: 'Community garden shift log', host: 'Green Campus Society', depth: 2, points: 25,
      comps: ['comm2', 'team'], proof: 'reflection', approval: false, minWords: 20,
      blurb: 'Do three shifts at the community garden and note what you worked on each time.' },
    { id: 's1', type: 'set', title: 'Career launch set', host: 'Career Centre', depth: 3, points: 50,
      comps: ['career'], parts: ['a1', 'a4', 'a6'],
      blurb: 'Finish all three parts to complete the set. The set gives its own points on top.' },
    { id: 's2', type: 'set', title: 'Good neighbour set', host: 'Student Life', depth: 3, points: 50,
      comps: ['comm2'], parts: ['a2', 'a12'],
      blurb: 'Two ways to give time to the town. Finish both to complete the set.' },
  ],

  badges: [
    { id: 'b1', name: 'First steps', desc: 'Complete any three activities.', rule: { anyCount: 3 } },
    { id: 'b2', name: 'Clear voice', desc: 'Complete three Communication activities.', rule: { comp: 'comm', count: 3 } },
    { id: 'b3', name: 'Good neighbour', desc: 'Complete the Good neighbour set.', rule: { activity: 's2' } },
    { id: 'b4', name: 'Career ready', desc: 'Complete the Career launch set.', rule: { activity: 's1' } },
    { id: 'b5', name: 'At the front', desc: 'Complete one activity at the Lead depth.', rule: { depth: 4, count: 1 } },
    { id: 'b6', name: 'All-rounder', desc: 'Complete an activity in every competency.', rule: { allComps: true } },
  ],

  orgs: [
    { id: 'o1', name: 'Green Campus Society', kind: 'Service', members: 83, about: 'Clean-ups, the community garden and the campus repair café.', events: ['a2', 'a12'],
      people: [['Amara Lindqvist', 'President'], ['Tom Reyes', 'Treasurer'], ['Priya Nand', 'Garden lead']] },
    { id: 'o2', name: 'Debate Union', kind: 'Academic', members: 41, about: 'Weekly motions, training for new speakers, two away tournaments a year.', events: ['a3'],
      people: [['Jonah Ferreira', 'Chair'], ['Mei Tanaka', 'Training officer']] },
    { id: 'o3', name: 'The Campus Post', kind: 'Media', members: 29, about: 'The student paper. Writers, editors, photographers and designers welcome.', events: ['a8'],
      people: [['Sadie Brennan', 'Editor'], ['Kofi Mensah', 'News editor']] },
    { id: 'o4', name: 'Trail Running Club', kind: 'Sport', members: 63, about: 'Three runs a week at every pace, and one race weekend each term.', events: [],
      people: [['Lena Havel', 'Captain'], ['Omar Idris', 'Kit and routes']] },
    { id: 'o5', name: 'Peer Mentoring', kind: 'Service', members: 112, about: 'Second-years and up, paired with first-year students for a term.', events: ['a10'],
      people: [['Grace Olawale', 'Coordinator']] },
    { id: 'o6', name: 'Makers Collective', kind: 'Arts', members: 37, about: 'Print, textiles, wood and electronics. Open studio on Wednesdays.', events: [],
      people: [['Idris Vance', 'Studio lead'], ['Hana Sato', 'Workshops']] },
  ],

  // Other students on the board (points are fixed sample values).
  peers: [
    { name: 'Amara Lindqvist', points: 640, program: 'B.A. Geography', last: 'Yesterday' },
    { name: 'Jonah Ferreira', points: 455, program: 'B.A. Politics', last: '2 days ago' },
    { name: 'Priya Nand', points: 380, program: 'B.Sc. Biology', last: '3 days ago' },
    { name: 'Kofi Mensah', points: 310, program: 'B.A. Journalism', last: 'Yesterday' },
    { name: 'Mei Tanaka', points: 265, program: 'B.Sc. Environmental Science', last: '2 days ago' },
    { name: 'Lena Havel', points: 190, program: 'B.Sc. Sport Science', last: '4 days ago' },
    { name: 'Tom Reyes', points: 150, program: 'B.A. Economics', last: '3 days ago' },
    { name: 'Sadie Brennan', points: 120, program: 'B.A. English', last: '5 weeks ago', quiet: true },
    { name: 'Omar Idris', points: 85, program: 'B.Sc. Chemistry', last: 'Yesterday' },
    { name: 'Hana Sato', points: 40, program: 'B.A. Design', last: '7 weeks ago', quiet: true },
  ],
  // How many other students have completed each activity (fixed sample values).
  baseDone: { a1: 38, a2: 22, a5: 61, a6: 17, a7: 6, a8: 9, a9: 44, a10: 12, a11: 14, a12: 19, s1: 5, s2: 11 },
  groups: [
    { name: 'Green Campus Society', points: 4210 }, { name: 'Peer Mentoring', points: 3890 }, { name: 'Debate Union', points: 2140 },
    { name: 'The Campus Post', points: 1675 }, { name: 'Trail Running Club', points: 1320 }, { name: 'Makers Collective', points: 940 },
  ],

  // What the demo starts with.
  seed: {
    completions: {
      a5: { status: 'done', at: '2 Sep', seq: 1 },
      a9: { status: 'done', at: '19 Sep', seq: 2, text: 'I will move my food shop to once a week and track bus fares.' },
      a12: { status: 'done', at: '6 Oct', seq: 3, text: 'Three shifts: compost bays, winter beds, tool shed tidy.' },
      a11: { status: 'done', at: '21 Oct', seq: 4, file: 'showcase-poster.pdf' },
    },
    joined: ['o1'],
    optOut: false,
    share: false,
    // Staff side: other students' submissions waiting for a decision.
    queue: [
      { id: 'q1', student: 'Mei Tanaka', activity: 'a6', at: '9 Nov',
        text: 'I spoke with a water quality officer at the regional council for about twenty minutes. I was surprised that most of her week is spent writing and explaining results to farmers, not in the field. Next I will take the science communication elective and ask to shadow a site visit in spring.' },
      { id: 'q2', student: 'Tom Reyes', activity: 'a8', at: '8 Nov', file: 'post-student-housing-article.pdf' },
      { id: 'q3', student: 'Lena Havel', activity: 'a10', at: '7 Nov',
        text: 'My mentee and I met five times this term. In our third meeting I had planned to talk about exam timetables, but she wanted to talk about whether to change course. I stopped giving advice and asked questions instead, and she worked out that she wanted to speak to her tutor first. I learned to bring fewer plans and to leave more room for what the other person needs that day.' },
      { id: 'q4', student: 'Omar Idris', activity: 'a7', at: '10 Nov',
        text: 'I went to the chemistry study group in the library every week for four weeks. Hana ran it and booked the room each time. I found the practice questions useful and I think my marks will improve because of it. The group was friendly and I would go again next term. I did not have to change anything after the first week because it was already well organised.' },
    ],
    custom: [],   // activities staff created
    edits: {},    // staff changes to built-in activities, by id
    others: {},   // other students given credit by staff, by activity id
    peerBonus: {}, // points other students gained through staff decisions
    log: [
      { at: '6 Nov', student: 'Priya Nand', title: 'Write for the campus paper', decision: 'Approved', note: '' },
      { at: '5 Nov', student: 'Jonah Ferreira', title: 'Informational interview', decision: 'Sent back', note: 'Tell us what you will do next, not only what was said.' },
    ],
  },
};
