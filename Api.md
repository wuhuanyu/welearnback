
# 账户 /acc
## 注册
post /acc/stu

post /acc/tea

request:`{name,password,gender}`

response: 
1. `200 {result:savedId,msg:"SignUp successfully"}`
2. `400 {msg:wrong format}`

## 增加课程(stu 和 teacher 类似)
post /acc/stu/:id/course

request: `{cS:[id,id]}`

response:`{msg:Course Selected  Successfully}`

## 获取课程 (stu 和teacher 类似)
get /acc/stu/:id/courses
response:`{count:count,data:courses}`


# 课程相关
## 增加课程
post /course 

**Note:上传文件和图片不能超过五张，必须是multipart-form,**
**文件域名为upload，课程相关信息课程名称name，课程描述desc**

## 获取课程信息详细信息，含有图片
get /course/:id

response:`{count:1,data:foundData}`

get /course?name=:name

response:`{count:1,data:foundData}`

## 获取课程简略信息，没有图片，分页
get /course/all?start=:start&count=:count

response:`{count:count,data:foundCourses}`

## 教师为课程发布问题(含图片)
post /course/:id/question

**上传文件要求同上**

**必须的字段 type,body,ans,见名知意**

response:`{result:saved.id:msg:"Question Upload Successfully"}`

## 获取某课程上的所有问题
get /course/:id/questions

response: `{count:datas.length,data:datas}`

## 就某问题发表评论
post /course/:courseId/:questionId/comment

**必须的字段 body**

response:`{result:saved.id,msg:"Comment Succesfully"}`

## 获取该问题的所有评论
get /course/:courseId/:questionId/comments

response: `{count:datas.length,data:datas}`