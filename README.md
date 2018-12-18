# math-folding
Research for number folding puzzels

## Install and run

    $ npm install
    $ npm run hot
    $ npm run dev

Then access: http://localhost:8080/

## Background
(Chinese edition)

### 对折序列问题（Number Folding Problem）

虽然问题本身很容易理解，不过名不正则言不顺，首先需要定义一些概念。以下命名皆为本人自行命名，未查证在数学里的标准命名，未必严格，可能有所出入：
* **轮**（_Turn_）：经过一系列操作使对象达到与操作前“**自相似**”的状态，我们称为“一轮”，每一轮都有着相同的操作序列。如一张纸条从右往左对折，成为宽度减半，厚度加倍的“纸条”，这算作一轮；一张正方形的纸，从下往上对折，然后从右往左对折，成为面积1/4，厚度4倍的“纸”，这也算作是一轮。
* **阶**（_Order_）：问题的“维数”（dimension），简记为**r**。如纸条的对折，称为“一阶”的；而正方形纸的对折，称为“二阶”的。
* **基**（_Base_）：以**2**为底，**阶数**为指数的幂次数（此为一般数学意义上的幂次，与下面特指的“幂次”稍有区别），简记为**b**。
* **幂次**（_Power_）：或称“次数”，简称“**次**”，简记为**k**。显然，幂次就是“**轮数**”（count of turns）。
* **元**（_Unit_）：即写在操作对象上的那些自然数。事实上未必一定要是数字，任何可数有序的符号元素（组成“全序集”）皆可，为方便叙述与理解该问题，我们在此仅采用从1开始的连续自然数序列。数字的总数称为“**元数**”，简记为**n**。

一些显见的结论：
* $ b=2^r $。一阶对折的基为2，二阶对折的基为4（$ 2^2 $），等等。
* 只有一阶对折情形下，“次”等于真实对折的次数**k**。高于一阶，真实对折次数=$ k*r $。如二阶对折实际要折叠2k次。
* $ n=b^k=(2^r)^k=2^(k*r)=2^对折次数 $。如一阶二次是4个数（也称为一阶四元对折），二阶三次是64个数（也称为二阶64元对折），等等。

先从简单的“一阶对折问题”（First Order Folding）入手。

#### 一阶对折（First Order Folding）

问题：

一张纸条，均分成$ n=2^k $格，每个格子内按从左到右顺序写下自然数序列1，2，3，……，n

将纸条从右往左不断对折（共k次），直至剩下一个格子，求：
 1) 最后从下往上数字的序列
 2) 数字m（$ 1<=m<=n $）的最终位置
 3) 最终序列中位置x的数字

| 名称     | 一阶一次对折 | 一阶二次对折 | 一阶三次对折    |
| :------- | :----------- | :----------- | :-------------- |
| 初始序列 | 1 2          | 1 2 3 4      | 1 2 3 4 5 6 7 8 |
| 对折次数 | 1            | 2            | 3               |
| 最终序列 | 1 2          | 1 4 3 2      | 1 8 5 4 3 6 7 2 |

#### 二阶对折（Second Order Folding）

问题：

一张正方形的纸，均分成$ n=4^k $格，先按从左到右，然后从上到下顺序在每个格子写下自然数序列1，2，3，……，n

将纸条先从下往上，然后从右往左不断对折（共k轮，2k次），直至剩下一个格子，求：
1) 最后从下往上数字的序列
2) 数字m（$ 1<=m<=n $）的最终位置
3) 最终序列中位置x的数字
