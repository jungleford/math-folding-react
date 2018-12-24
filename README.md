# math-folding
Research for number folding puzzels

## Install and run

    $ npm install
    $ npm run start

After compiled successfully, then access: http://localhost:8080/

## Background: 对折序列问题（Number Folding Problem）
(Chinese edition)

虽然问题本身很容易理解，不过名不正则言不顺，首先需要定义一些概念。以下命名皆为本人自行命名，未查证在数学里的标准命名方式，未必规范严格，可能有所出入：
* **轮**（_Turn_）：经过一系列操作使对象达到与操作前“**自相似**”的状态，我们称为“一轮”，每一轮都有着相同的操作序列。如一张纸条从右往左对折，成为宽度减半，厚度加倍的“纸条”，这算作一轮；一张正方形的纸，从下往上对折，然后从右往左对折，成为面积1/4，厚度4倍的“纸”，这也算作是一轮。
* **步**（_Step_）。每一轮操作可以细分成若干步，每一步即为一次对折操作。完成整个折叠过程的总“步数”简记为**s**。
* **次**（_Power_）：或称“次数”，“**幂次**”，简记为**k**。显然，“幂次”就是“**轮数**”（count of turns）。但“次数”却未必等于“**步数**”（count of steps），当且仅当——见如下“**阶**”的定义——一阶情况下，“次数”才等于“步数”。
* **阶**（_Order_）：问题的“维数”（_dimension_），简记为**r**。如纸条的对折，称为“**一阶**”的；而正方形纸的对折，称为“**二阶**”的。
* **基**（_Base_）：以**2**为底，**阶数**为指数的幂次数（此为一般数学意义上的幂次，与前面所定义的“幂次”有所区别），简记为**b**。
* **元**（_Unit_）：即写在操作对象上的那些自然数。事实上未必一定要是数字，任何可数有序的符号元素（组成“全序集”）皆可，为方便叙述与理解该问题，我们在此仅采用从1开始的连续自然数序列。数字的总数称为“**元数**”，简记为**n**。
* **堆**（_Pile_）：初始状态下，每个数字单独组成一个堆，共**n**堆。当每一**步**对折操作结束后，堆数减半；而当每一**轮**操作结束后，堆数减少为前一轮的**1/b**。

一些显见的结论：
* $ b=2^r $。一阶对折的基为2，二阶对折的基为4（$ 2^2 $），以此类推。
* 幂次等于轮数**k**。只有一阶对折情形下，“次”等于真实对折的次数（即“步数”），即$ s=k $。高于一阶，$ s=k*r $。如二阶对折实际要折叠**2k**次。
* 每一**步**对折操作结束后，堆数减半；每一**轮**操作结束后，堆数减少为前一轮的$ 1/b $。
* $ n=b^k=(2^r)^k=2^(k*r)=2^s $。如“一阶二次”是4个数（也称为一阶四元对折），“二阶三次”是64个数（也称为二阶64元对折），等等。

一些不那么显见的结论：
* 数字和位置的**对称性**。见以下讨论。

先从简单的“一阶对折问题”（_First Order Folding_）入手。

### 一阶对折（First Order Folding）

#### 问题：

一张纸条，均分成$ n=2^k $格，每个格子内按从左到右顺序写下自然数序列1，2，3，……，n

将纸条从右往左不断对折（共**k**步），直至剩下一个格子，求：
1) 最后从下往上数字的序列
1) 数字x（$ 1<=x<=n $）的最终位置
1) 最终序列中位置p的数字

| 名称     | 一阶一次对折 | 一阶二次对折 | 一阶三次对折    |
| :------- | :----------- | :----------- | :-------------- |
| 初始序列 | 1 2          | 1 2 3 4      | 1 2 3 4 5 6 7 8 |
| 对折次数 | 1            | 2            | 3               |
| 最终序列 | 1 2          | 1 4 3 2      | 1 8 5 4 3 6 7 2 |

一阶对折的对称性：
* 对折前显然是对称，然而经过**k**轮对折后，依然是对称的！记$ p(x) $为对折后数字x在最终序列的位置，$ v(p) $为对折后位置p上的数字，则有：
  1) 给定同一个x，有$ p(x)=v(x) $
  1) $ p(p(x))=x $
  1) $ v(v(x))=x $

### 二阶对折（Second Order Folding）

#### 问题：

一张正方形的纸，均分成$ n=4^k $格，先按从左到右，然后从上到下顺序在每个格子写下自然数序列1，2，3，……，n

将纸条先从下往上，然后从右往左不断对折（共**k**轮，**2k**步），直至剩下一个格子，求：
1) 最后从下往上数字的序列
1) 数字x（$ 1<=x<=n $）的最终位置
1) 最终序列中位置p的数字

### 算法
目前仅支持最容易设计的“**递归**算法”（_Recursive_）。请参见源代码中各组件的service部分。