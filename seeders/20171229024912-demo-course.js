'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
		return queryInterface.bulkInsert('courses',[
			{name:'高等数学',desc:'大一刚上数学分析课程的时候，我就曾了教我们的老师讨论过，数学到底是不是一门艺术。老师肯定地回复我说是，而且他告诉我数学中最优美的学科叫《复变函数》，可惜的是他可能没有机会来给我们上这么课了。可是真的到上这门课程的时候，虽然那个老师讲得也还凑合，我考试也拿了个90分，可是发觉除了积分公式剩下的就是一大堆的级数啊，变换啊，解析延拓，零极点啊等等，唯一感觉到一点优美的地方就是代数基本定理的证明。一门课学下来，感觉这哪里是艺术，分明是概念的堆砌嘛。至于后面还选修了一门多复变的课程，那就更是云里雾里混学分了。等到读研究生的时候，数学也不再是我的专业了，可我依然保留着有空读一点数学书的习惯。偶然之间发现了这本《复分析--可视化方法》，真是如获至宝啊。'},
			{name:'历史之美',desc:'故事性的叙述文字交织着美丽精彩的图像，就像一部全息的立体电影，这样独一无二的感受你有过吗？鲜活真切、生动有趣也可以是历史的另一个名字，引领我们在最自然的状态里有效地吸取历史精髓的同时又获取了思考上的提升——就像有氧呼吸那样。在这里，原本厚重肃穆的历史话题有机会轻灵上阵，换一副头面与我们亲密接触。放在读者面前的这部著作，内容是严肃的，信息是丰富的。而上千幅生动的彩图，轻松的故事性的语言，则能使读者于闲适愉悦之中，把握中国历史大势，领略中国文化精髓。'},
			{name:'欧洲现代艺术',desc:'写得实在太棒了，两希文明、伯格曼的身世以及他的作品，导演风格和主创的理据都在里面了。很少看到这样精辟的对伯格曼电影的解读，伯格曼的电影一直是拉康说的想象界，属于第二符号学的层面会更多一点，实际上能把这个层面讲清楚，作者还是挺不容易的。之前对于伯格曼的作品知之甚少，通读这本书大有裨益的。'},
		]);
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      // return queryInterface.bulkDelete('Person', null, {});
    */

		return queryInterface.bulkDelete('courses', null, {});
	}
};
