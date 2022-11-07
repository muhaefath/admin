const dataTest = {
  lmsyear: [
    { id: 1, name: "2021/2022" },
    { id: 2, name: "2022/2023" },
  ],
  lmslevel: [
    { id: 1, name: "SD 1" },
    { id: 2, name: "SD 2" },
  ],
  lmsgrade: [
    { id: 1, name: "SD 1 A", levelid: 1 },
    { id: 2, name: "SD 1 B", levelid: 1 },
  ],
  lmsclass: [
    { id: 1, name: "XII IPA" },
    { id: 2, name: "" },
  ],
  lmssubject: [{ id: 1, subjectname: "IPA" }],
  lmsstudent: [
    {
      id: 1,
      studentname: "Bobi",
    },
  ],
  lmsteacher: [
    {
      id: 1,
      teachername: "Teacher",
    },
  ],
  lmsassignment: [{id: 1, title: "New Assignment A", date: new Date(), classname: "SD 1", stat: 0}, {id: 2, title: "New Assignment B", date: new Date(), classname: "SD 2", stat: 1 }],
  lmsassessment: [{id: 1, title: "New Assessment A", date: new Date(), classname: "SD 1", stat: 0  }, {id: 2, title: "New Assessment B", date: new Date(), classname: "SD 2", stat: 1 }],
  Lmsassessmentquestion: [{seq: 1, question: "Q1", type: 'instruction', answer: "answer", trueanswer: "trueanswer"}, 
    {seq: 2, question: "Q2", type: 'short' , section: 1, answer: "answer", trueanswer: "trueanswer"},
    {seq: 3, question: "Q3", type: 'essay' , section: 1, answer: "answer", trueanswer: "trueanswer" },
    {seq: 4, question: "Q4", type: 'choice' , section: 1, answer: "answer", trueanswer: "trueanswer" },
    {seq: 5, question: "Q5", type: 'multiple' , section: 1, answer: "answer", trueanswer: "trueanswer" },
    {seq: 5, question: "Q6 [FIB]", type: 'fib' , section: 1, answer: "answer", trueanswer: "trueanswer"},
    {seq: 5, question: "Q7", type: 'match' , section: 1, answer: "answer", trueanswer: "trueanswer" },
    {seq: 5, question: "Q8", type: 'numerical' , section: 1, answer: "answer", trueanswer: "trueanswer" },
  ],
  lmslearningmaterial: [{id: 1, title: "New Learn A", date: new Date(), classname: "SD 1", stat: 0 }, {id: 2, title: "New Learn B", date: new Date(), classname: "SD 2",  stat: 1 }],
   
};

export default dataTest;
