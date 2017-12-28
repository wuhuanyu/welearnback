# Module
## 1. Account
### SignUp
1. Account Type: Teacher(Maths,English,etc),Student,Admin
2. Admin signup has to be confirmed by Teacher?
3. 学生的基本信息：姓名，学号，性别,ip
4. 老师的基本信息：姓名，性别,ip
### Login
To be continued...
### 相关信息录入
1. 作为学生，选择你学了那些课,软件只显示选择的课程
1. 作为老师，选择你教授的课程,软件只显示教授的课程



## 2. Homework,questions
1. Uploaded by teacher,viewed by students
 
## 3. Social
1. Comment of homework,questions etc.
1. Answers by students
1. Group brainstorm?
1. Answers by teacher
1. Suggestions by students compiled by admin

## 4. Info Post
1. Info post by admin
1. Urge students to finish work

## 5. Data structure
***mysql***

<br>
Student:id(sId),name,gender
<br>
Teacher:id(tId),name,gender
<br>
Course:id(cId),name,desciption
<br>
Student-Course:sId,cId
<br>
Teacher-Course:tId,cId
<br>

***mongodb***

Question:id(qId),type,cId,tId,body,abcd,ans,time,

Comment:id,qId,aT,aId(sId,tId),time,body

Note:基本的思路是面向课程，及根据学生和老师的双向选择构建平台。学生和老师通过选择课程达成联系。
<br>
