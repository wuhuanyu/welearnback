const router=require('express').Router();
const models=require('../models/models');
const TAG='[Question router]: ';
const teacher_auth=require('../auth/auth_middleware').teacher_auth;
const student_auth=require('../auth/auth_middleware').student_auth;
const common_auth=require('../auth/auth_middleware').common_auth;
const defaultConfig=require('../config/uploadconfig').defaultConfig;
const md5=require('md5');
const Constants=require('../constants');
const constant=Constants;
const isImage=require('../utils/check').isImage;
const getError=require('../utils/error');
const applyErrMiddleware=require('../utils/async_middleware');
const findByFieldFactory=require('../utils/commonquery');

/**
 * 
 * @param {Object} options 
 */
const getImageNames = async (options) => {
	let { forT, fId } = options;
	console.log(fId);
	let images = await models._File.findAll({
		where: { forT: forT, fId: fId, fT: Constants.FT_IMAGE },
		attributes: ['name']
	});
	let imageNames = [];
	for (let im of images) {
		imageNames.push(im.name);
	}
	return imageNames;
};
/** 
 * authentication assumed 
 * req.auth.{tId,name,password}
 * post question of a certain course
 * /23/question
 */
router.post('', teacher_auth, defaultConfig, applyErrMiddleware((req, res, next) => {
	let b = req.body, cid = req.url_params.course_id;
	let auth = req.auth;
	let files = req.files['upload'];
	//check fields
	// let question_id=md5(new Date().getTime()+req.body.body);
	if (['type', 'body'].every(f => Object.keys(b).indexOf(f) > -1)) {
		let newQ = new models.Question({
			// _id: question_id,
			type: b.type,
			cId: cid,
			tId: req.auth.id,
			body: b.body,
			time: new Date().getTime(),
		});
		newQ.save().then(savedQ => {
			let savePromsies = files.map(file => {
				let { originalname, size, filename, path } = file;
				let newF = models._File.build({
					aT: Constants.ACC_T_Tea,
					aId: auth.id,
					forT: Constants.ForT_Question,
					fId: savedQ._id,
					fT: (isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
					original_name: originalname,
					name: filename,
					dir: path,
				});
				return newF.save();
			});
			Promise.all(savePromsies).then(saved => {
				res.status(200).json({
					result: savedQ._id,
					msg: 'Question Upload Successfully'
				});
			});
		}).catch(e => {
			next(getError(500, e.message));
		});
	} else {
		next(getError(404, 'Wrong Question Format'));
	}
}));

/**
 * /12/question
 * get all questions of 12 course
 */
router.get('', applyErrMiddleware(async (req, res, next) => {
    let cId = req.url_params.course_id;
    let start=req.que
	let questions = await (findByFieldFactory('question', ['cId'], { time: -1 }))([cId]);
	if (questions.length === 0) throw getError(404, 'No such resource');
	let quesitonsWithImage = [];
	for (let q of questions) {
		let images = await getImageNames({ fId: q._id, forT: Constants.ForT_Question });
		let obj = q.toObject();
		obj.images = images;
		quesitonsWithImage.push(obj);
	}
	res.json({
		count: questions.length,
		data: quesitonsWithImage
	});
}));


/**
 * post ans to 
 * /course/:courseId/:questionId/ans
 */
router.post(/^\/(\w+)\/ans$/, teacher_auth, defaultConfig, applyErrMiddleware(async (req, res, next) => {
	let auth = req.auth;
	let courseId = req.url_params.course_id , questionId = req.params[0];
	let files = req.files['upload'];
	let imageNames = files.map(f => f.originalname).filter(fileName => isImage(fileName));
	let fileNames = files.map(f => f.originalname).filter(fileName => !isImage(fileName));
	let ans_id = md5(new Date().getTime()+req.body.body);
	let updated = await models.Question.update({ _id: questionId }, {
		$push: {
			anss: {
				_id: ans_id,
				body: req.body.body,
				files: fileNames,
				images: imageNames,
			}
		}
	});
	let savedFiles = [];
	for (let file of files) {
		let { originalname, size, filename, path } = file;
		let newF = _File.build({
			aT: Constants.ACC_T_Tea,
			aId: auth.id,
			forT: Constants.ForT_Question,
			fId: ans_id,
			fT: (isImage(originalname) ? Constants.FT_IMAGE : Constants.FT_FILE),
			original_name: originalname,
			name: filename,
			dir: path,
		});
		let savedF = await newF.save();
		savedFiles.push(savedF.id);
	}
	res.json({
		result: updated,
		msg: 'Answer upload successfully',
	});
	// res.end();

}));


/**
 * 
 *  /12/12/comment
 * must specify user type 
 */
router.post(/^\/([0-9]+)\/(\w+)\/comment$/, defaultConfig, common_auth, applyErrMiddleware(async (req, res, next) => {
	console.log('-------post comment to question--------');
	let c = req.params[0], q = req.params[1], author_type = req.auth.type;
	let comment_id = md5(new Date().getTime()+req.body.body);
	// console.log(JSON.stringify(req.body));
	let body = req.body;
	let newC = new Comment({
		_id: comment_id,
		forT: constants.ForT_Question,
		forId: q,
		//must have type
		aT: author_type,
		aId: req.auth.id,
		body: body.body,
		time: new Date().getTime()
	});
	let savedC = await newC.save();

	/**
         * upload file processing
         */
	let files = req.files['upload'];
	let savedFiles = [];
	if (files && (files.length !== 0)) {
		//there is file
		for (let file of files) {
			let { originalname, size, filename, path } = file;
			let newF = _File.build({
				aT: author_type,
				aId: req.auth.id,
				forT: constants.ForT_Comment,
				fId: comment_id,
				fT: (isImage(originalname) ? constants.FT_IMAGE : constants.FT_FILE),
				original_name: originalname,
				name: filename,
				dir: path
			});
			console.log('file');
			savedFiles.push(await newF.save());
		}
	}
	//if there is file,
	if (files && (files.length !== 0)) {
		console.log('there is file');
		//check if every files saved;
		if (files.length === savedFiles.length) {
			res.status(200).json({
				msg: 'Comment Successfully!',
				result: savedC.id,
			});
		}
		else throw getError(500, 'Something happens when storing file');
	}
	else
		res.status(200).json({
			msg: 'Comment Successfully!',
			result: savedC._id,
		});

}
// }
)
);

/**
 * /course/question/comments
 * /12/24/comments
 * get all comments of a question of a course
 */
router.get(/^\/([0-9]+)\/(\w+)\/comments$/, applyErrMiddleware(async (req, res, next) => {
	let c = req.params[0], q = req.params[1];
	let comments = await findByFieldFactory('comment', ['forT', 'forId'], { time: 1 })([constants.ForT_Question, q]);
	if (comments.length === 0) throw getError(400, 'No such resource');
	let datas = [];
	for (let comment of comments) {
		let aT = comment.aT;
		let aId = comment.aId;
		let user = (aT === constants.ACC_T_Tea ? Teacher : Student);
		let userFound = await user.findById(aId);
		let data = comment.toJSON();
		// console.log(data);
		let images = await getImageNames({ forT: constants.ForT_Comment, fId: comment._id });
		data.author = userFound.name;
		data.images = images;
		datas.push(data);
	}
	res.json({
		count: datas.length,
		data: datas
	});
}));



module.exports=router;