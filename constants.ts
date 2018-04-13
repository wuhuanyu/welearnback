/**
 * Account type 1*
 */
export const ACC_T_Tea=11;
export const ACC_T_Stu=12;
export const ACC_T_Admin=13;

/**
 * Basic info 2*
 */
export const MALE=21;
export const FEMALE=22;

/**
 *  question type
 */
export const SELECT=31;
export const QA=32;

//for what kind 
export const ForT_Comment=41;
export const ForT_Question=42;
export const ForT_Course=43;
export const ForT_Ans=44;
export const ForT_Video=45;

//file types,image or common file
export const FT_FILE=52;
export const FT_IMAGE=53;

/**
 * events 
 * 以课程为话题,以下列的事情为代码 ，比如 数学课发布了新的习题 /数学   payload: {code:63,msg:""}
 */
export const new_comment_course=98;
export const new_comment_course_by_teacher=97;

export const new_question=96;

/**
 * /数学 payload:{code:64,question_id:id,data:{}}
 */
export const new_comment_question=95;

export const new_comment_question_by_teacher=94;

export const NEW_LIVE_RESERVED=91;
export const NEW_LIVE_STARTED=90;


/**
 * /数学
 */
export const new_message=50;

export const bulletin=99;





