// ========== 共享教师数据 ==========
// 用于 index.html 首页展示 + teachers.html 老师列表页
const allTeachers = [
  // === 北京 ===
  { name:"王晓明", gender:"男", edu:"985硕士", area:"北京", subjects:"数学·物理", grades:"高中·高考", years:8, tags:["竞赛专项","高考冲刺","耐心细致"], price:"200-280元/时", emoji:"王" },
  { name:"吴佳慧", gender:"女", edu:"985本科", area:"北京", subjects:"数学·英语", grades:"小学·初中", years:3, tags:["英美外教背景","趣味教学","提分显著"], price:"220-300元/时", emoji:"吴" },
  { name:"马晓东", gender:"男", edu:"985硕士", area:"北京", subjects:"化学·生物", grades:"高中·高考", years:12, tags:["高考阅卷","理综满分","押题准"], price:"250-350元/时", emoji:"马" },
  { name:"林雪怡", gender:"女", edu:"211本科", area:"北京", subjects:"语文·英语", grades:"小学·初中", years:4, tags:["阅读启蒙","作文指导","耐心负责"], price:"150-200元/时", emoji:"林" },

  // === 上海 ===
  { name:"李思雨", gender:"女", edu:"211本科", area:"上海", subjects:"英语·语文", grades:"初中·高中", years:5, tags:["口语流利","写作提升","亲和力强"], price:"180-250元/时", emoji:"李" },
  { name:"郑文博", gender:"男", edu:"211博士", area:"上海", subjects:"物理·数学", grades:"高中·竞赛", years:11, tags:["物理竞赛银牌","高考满分","严格要求"], price:"280-400元/时", emoji:"郑" },
  { name:"沈俊逸", gender:"男", edu:"985本科", area:"上海", subjects:"英语·历史", grades:"高中·留学", years:6, tags:["雅思8.5","双语授课","留学规划"], price:"260-350元/时", emoji:"沈" },

  // === 广州 ===
  { name:"陈建国", gender:"男", edu:"名校博士", area:"广州", subjects:"化学·生物", grades:"高中·竞赛", years:10, tags:["竞赛教练","实验讲解","逻辑清晰"], price:"260-350元/时", emoji:"陈" },
  { name:"黄雅琪", gender:"女", edu:"师范硕士", area:"广州", subjects:"语文·政治", grades:"初中·高中", years:7, tags:["答题模板","作文提分","文科全科"], price:"180-240元/时", emoji:"黄" },

  // === 成都 ===
  { name:"张美丽", gender:"女", edu:"师范本科", area:"成都", subjects:"语文·数学", grades:"小学", years:6, tags:["启蒙专家","趣味教学","家长好评"], price:"120-180元/时", emoji:"张" },

  // === 南京 ===
  { name:"刘志强", gender:"男", edu:"985本科", area:"南京", subjects:"数学·信息", grades:"初中·高中", years:7, tags:["奥数金牌","编程竞赛","逻辑思维"], price:"220-300元/时", emoji:"刘" },

  // === 杭州 ===
  { name:"赵雅婷", gender:"女", edu:"211硕士", area:"杭州", subjects:"英语·历史", grades:"初中·高中", years:4, tags:["托福满分","双语教学","外向活泼"], price:"200-280元/时", emoji:"赵" },

  // === 武汉 ===
  { name:"孙浩然", gender:"男", edu:"重点本科", area:"武汉", subjects:"物理·化学", grades:"高中·中考", years:9, tags:["理综专家","题型总结","提分快"], price:"180-240元/时", emoji:"孙" },

  // === 西安 ===
  { name:"周晨曦", gender:"女", edu:"师范硕士", area:"西安", subjects:"语文·政治", grades:"高中·中考", years:6, tags:["答题技巧","作文满分","文科全能"], price:"160-220元/时", emoji:"周" },

  // === 深圳 ===
  { name:"冯雪莹", gender:"女", edu:"师范本科", area:"深圳", subjects:"英语·语文", grades:"小学·初中", years:5, tags:["口语纯正","阅读提升","轻松愉快"], price:"180-250元/时", emoji:"冯" },
  { name:"钟思远", gender:"男", edu:"985硕士", area:"深圳", subjects:"数学·编程", grades:"初中·高中", years:6, tags:["Python·C++","NOIP教练","项目实战"], price:"240-320元/时", emoji:"钟" },

  // === 重庆 ===
  { name:"何俊杰", gender:"男", edu:"985本科", area:"重庆", subjects:"数学·物理", grades:"初中·高中", years:6, tags:["中考状元","思路清晰","善于总结"], price:"160-220元/时", emoji:"何" },

  // === 更多城市 ===
  { name:"戴晓云", gender:"女", edu:"211硕士", area:"长沙", subjects:"生物·化学", grades:"高中·高考", years:5, tags:["遗传题突破","实验设计","高校背景"], price:"180-240元/时", emoji:"戴" },
  { name:"韩磊", gender:"男", edu:"名校博士", area:"天津", subjects:"物理·数学", grades:"高中·竞赛", years:13, tags:["强基计划","竞赛保送","学术严谨"], price:"300-450元/时", emoji:"韩" },
  { name:"唐诗雅", gender:"女", edu:"师范本科", area:"苏州", subjects:"英语·美术", grades:"小学·初中", years:4, tags:["创意教学","艺术融合","启蒙高手"], price:"150-200元/时", emoji:"唐" },
  { name:"曹明哲", gender:"男", edu:"985本科", area:"郑州", subjects:"数学·物理", grades:"初中·中考", years:8, tags:["中考冲刺","题型归纳","口碑好"], price:"160-200元/时", emoji:"曹" },
  { name:"许婉清", gender:"女", edu:"211本科", area:"济南", subjects:"语文·历史", grades:"初中·高中", years:3, tags:["文言文攻克","历史脉络","考点精准"], price:"140-200元/时", emoji:"许" },
  { name:"潘逸飞", gender:"男", edu:"985硕士", area:"合肥", subjects:"奥数·信息", grades:"小学·初中", years:7, tags:["华杯一等奖","思维拓展","幽默风趣"], price:"200-280元/时", emoji:"潘" },
  { name:"姚佳琳", gender:"女", edu:"师范硕士", area:"南昌", subjects:"英语·政治", grades:"高中·高考", years:9, tags:["高三把关","作文模板","时政分析"], price:"180-250元/时", emoji:"姚" },
];
