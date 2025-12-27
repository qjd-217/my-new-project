import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Upload, 
  User, 
  Settings, 
  FileText, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  BrainCircuit,
  LayoutDashboard,
  Trophy,
  LogOut,
  AlertCircle
} from 'lucide-react';

// --- 模拟数据 ---
const INITIAL_EXAMS = [
  {
    id: 'ex-001',
    title: '2024 年度安全生产知识考核',
    category: '安全合规',
    questionsCount: 5,
    duration: 30, // 分钟
    questions: [
      { id: 1, type: 'single', text: '在生产区域内，严禁进行下列哪种行为？', options: ['戴安全帽', '穿工作服', '吸烟', '佩戴工牌'], answer: 2 },
      { id: 2, type: 'single', text: '灭火器压力表指针在什么区域表示压力正常？', options: ['红色', '黄色', '绿色', '蓝色'], answer: 2 }
    ]
  },
  {
    id: 'ex-002',
    title: '机械加工工艺标准 A 版',
    category: '技术规范',
    questionsCount: 10,
    duration: 60,
    questions: []
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('employee'); // 'employee' or 'admin'
  const [view, setView] = useState('home'); // 'home', 'taking-exam', 'result'
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [selectedExam, setSelectedExam] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- 模拟 AI 出题逻辑 ---
  const handleGenerateExam = async (e) => {
    e && e.preventDefault();
    setIsGenerating(true);
    // 模拟文件上传进度
    for (let i = 0; i <= 100; i += 20) {
      setUploadProgress(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 200));
    }

    // 模拟调用 AI 接口生成题目
    setTimeout(() => {
      const newExam = {
        id: `ex-${Date.now()}`,
        title: "新生成的 AI 试卷 - " + new Date().toLocaleDateString(),
        category: "自动生成",
        questionsCount: 3,
        duration: 20,
        questions: [
          { id: 1, type: 'single', text: '基于文档：本工艺的标准误差范围是多少？', options: ['±0.01mm', '±0.05mm', '±0.1mm', '无误差'], answer: 0 },
          { id: 2, type: 'single', text: '文档中提到的核心润滑液型号是？', options: ['L-HT3', 'M-202', 'G-Standard', 'Z-Alpha'], answer: 1 },
          { id: 3, type: 'single', text: '操作前必须进行的自检项目不包括？', options: ['压力测试', '外观检查', '温度标定', '午休打卡'], answer: 3 },
        ]
      };
      setExams([newExam, ...exams]);
      setIsGenerating(false);
      setUploadProgress(0);
    }, 1500);
  };

  // --- 考试逻辑 ---
  const startExam = (exam) => {
    setSelectedExam(exam);
    setUserAnswers({});
    setView('taking-exam');
  };

  const submitExam = () => {
    let correct = 0;
    selectedExam.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correct++;
    });
    const finalScore = Math.round((correct / selectedExam.questions.length) * 100);
    setScore(finalScore);
    setView('result');
  };

  // --- UI 组件 ---
  const SidebarItem = ({ icon: Icon, label, id, active }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-10 text-blue-600">
            <BrainCircuit size={32} />
            <span className="text-xl font-bold tracking-tight">智考系统 v1.0</span>
          </div>
          
          <nav className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="员工考试端" id="employee" active={activeTab === 'employee'} />
            <SidebarItem icon={Settings} label="管理员端" id="admin" active={activeTab === 'admin'} />
          </nav>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center space-x-3 p-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              张
            </div>
            <div>
              <p className="text-sm font-semibold">张工 (技术部)</p>
              <p className="text-xs text-gray-400">在线</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-gray-700">
            {activeTab === 'employee' ? '我的考核中心' : '考务管理平台'}
          </h2>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {activeTab === 'employee' ? (
            /* 员工端 */
            view === 'home' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg">
                    <p className="text-blue-100 text-sm">待参加考试</p>
                    <p className="text-3xl font-bold mt-1">{exams.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <p className="text-gray-400 text-sm">累计获得积分</p>
                    <p className="text-3xl font-bold mt-1 text-yellow-600">850</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <p className="text-gray-400 text-sm">考试通过率</p>
                    <p className="text-3xl font-bold mt-1 text-green-600">92%</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="font-bold flex items-center space-x-2">
                      <BookOpen size={18} className="text-blue-600" />
                      <span>可用考试列表</span>
                    </h3>
                  </div>
                  <div className="divide-y">
                    {exams.map(exam => (
                      <div key={exam.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <h4 className="font-bold text-gray-800">{exam.title}</h4>
                          <div className="flex space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center"><FileText size={14} className="mr-1"/> {exam.questionsCount} 题</span>
                            <span className="flex items-center"><Clock size={14} className="mr-1"/> {exam.duration} 分钟</span>
                            <span className="bg-gray-100 text-gray-600 px-2 rounded text-xs leading-5">{exam.category}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => startExam(exam)}
                          disabled={exam.questions.length === 0}
                          className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            exam.questions.length === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          <span>{exam.questions.length === 0 ? '试卷加载中' : '开始考试'}</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : view === 'taking-exam' ? (
              <div className="bg-white rounded-2xl border shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-8 pb-4 border-b">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedExam?.title}</h3>
                    <p className="text-gray-400 mt-1">请认真阅读题目后选择正确答案</p>
                  </div>
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-mono font-bold flex items-center">
                    <Clock size={18} className="mr-2" />
                    29:55
                  </div>
                </div>

                <div className="space-y-10">
                  {selectedExam?.questions.map((q, idx) => (
                    <div key={q.id} className="space-y-4">
                      <p className="text-lg font-medium flex">
                        <span className="text-blue-600 font-bold mr-2">Q{idx + 1}.</span>
                        {q.text}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => setUserAnswers({...userAnswers, [idx]: optIdx})}
                            className={`p-4 text-left border rounded-xl transition-all ${
                              userAnswers[idx] === optIdx 
                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                : 'hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-bold mr-3 text-gray-400">{String.fromCharCode(65 + optIdx)}.</span>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t flex justify-end">
                  <button 
                    onClick={submitExam}
                    className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                  >
                    提交试卷
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border shadow-xl p-12 text-center animate-in zoom-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={48} />
                </div>
                <h3 className="text-3xl font-bold mb-2">考试完成！</h3>
                <p className="text-gray-500 mb-8">系统已完成自动阅卷，以下是您的成绩</p>
                <div className="text-7xl font-black text-blue-600 mb-8">{score} <span className="text-2xl text-gray-400">/ 100</span></div>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => setView('home')}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"
                  >
                    返回首页
                  </button>
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                    查看错题解析
                  </button>
                </div>
              </div>
            )
          ) : (
            /* 管理员端 */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-2xl border shadow-sm">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <BrainCircuit className="text-purple-600 mr-2" />
                    AI 一键出题
                  </h3>
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                      isGenerating ? 'bg-gray-50 border-gray-200' : 'border-blue-200 bg-blue-50/30'
                    }`}
                  >
                    {!isGenerating ? (
                      <>
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload size={28} />
                        </div>
                        <h4 className="font-bold text-gray-700 mb-2">点击或拖拽上传学习文档</h4>
                        <p className="text-sm text-gray-400 mb-6">支持 PDF, DOCX, TXT 格式 (最大 20MB)</p>
                        <button 
                          onClick={handleGenerateExam}
                          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                        >
                          开始解析并生成考卷
                        </button>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        </div>
                        <div>
                          <p className="font-bold text-blue-600">AI 正在深度研读文档...</p>
                          <p className="text-sm text-gray-400 mt-1">正在基于知识点构建高频考题 ({uploadProgress}%)</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                          <div className="bg-blue-600 h-full transition-all" style={{width: `${uploadProgress}%`}}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border shadow-sm p-8">
                  <h3 className="font-bold mb-4">最近生成的考卷</h3>
                  <div className="space-y-3">
                    {exams.map(ex => (
                      <div key={ex.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="text-green-500" size={18} />
                          <span className="font-medium text-sm">{ex.title}</span>
                        </div>
                        <span className="text-xs text-gray-400">已分发给 12 名员工</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <h3 className="font-bold mb-4 text-sm uppercase text-gray-400 tracking-wider">部门学习概况</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm">本月人均考证</span>
                      <span className="text-xl font-bold">3.2 个</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm">最热门科目</span>
                      <span className="text-sm font-bold bg-blue-100 text-blue-700 px-2 rounded">机加工艺</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm">待批改主观题</span>
                      <span className="text-sm font-bold text-red-500">0 (AI已自动处理)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900 p-6 rounded-2xl text-white">
                  <h3 className="font-bold mb-2 flex items-center">
                    <BrainCircuit size={16} className="mr-2" /> 
                    AI 提效建议
                  </h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    根据最近 10 次考试数据，员工在“公差配合”环节错误率较高。建议 AI 下次出题时增加 30% 相关知识点的深度考核。
                  </p>
                  <button className="mt-4 w-full py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-xs font-bold transition-all">
                    应用智能加题策略
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
