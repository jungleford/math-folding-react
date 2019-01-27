# math-folding
Research for number folding puzzels

## Install and run

    $ npm install
    $ npm run start

After compiled successfully, then access: http://localhost:8080/

# Background: 对折序列问题（Number Folding Problem）
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
* ![](http://latex.codecogs.com/gif.latex?b=2^r)。一阶对折的基为2，二阶对折的基为4（![](http://latex.codecogs.com/gif.latex?2^2)），以此类推。
* 幂次等于轮数**k**。只有一阶对折情形下，“次”等于真实对折的次数（即“步数”），即![](http://latex.codecogs.com/gif.latex?s=k)。高于一阶，![](http://latex.codecogs.com/gif.latex?s=k*r)。如二阶对折实际要折叠**2k**次。
* 每一**步**对折操作结束后，堆数减半；每一**轮**操作结束后，堆数减少为前一轮的![](http://latex.codecogs.com/gif.latex?1/b)。
* ![](http://latex.codecogs.com/gif.latex?n=b^k=%282^r%29^k=2^{k*r}=2^s)。如“一阶二次”是4个数（也称为一阶四元对折），“二阶三次”是64个数（也称为二阶64元对折），等等。

一些不那么显见的结论：
* 数字和位置的**对称性**。见以下讨论。

先从简单的“一阶对折问题”（_First Order Folding_）入手。

## 一阶对折（First Order Folding）

### 问题

一张纸条，均分成![](http://latex.codecogs.com/gif.latex?n=2^k)格，每个格子内按从左到右顺序写下自然数序列1，2，3，……，n

将纸条从右往左不断对折（共**k**步），直至剩下一个格子，求：
1) 最后从下往上数字的序列
1) 数字x（![](http://latex.codecogs.com/gif.latex?1\le%20x\le%20n)）的最终位置
1) 最终序列中位置p的数字

| 名称     | 一阶一次对折 | 一阶二次对折 | 一阶三次对折    | 一阶四次对折                           |
| :------- | :----------- | :----------- | :-------------- | :------------------------------------- |
| 初始序列 | 1 2          | 1 2 3 4      | 1 2 3 4 5 6 7 8 | 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 |
| 对折次数 | 1            | 2            | 3               | 4                                      |
| 最终序列 | 1 2          | 1 4 3 2      | 1 8 5 4 3 6 7 2 | 1 16 9 8 5 12 13 4 3 14 11 6 7 10 15 2 |


#### 一阶对折的**对称性**

对折前显然是对称，然而经过**k**轮对折后，依然是对称的！记![](http://latex.codecogs.com/gif.latex?P%28x%29)为对折后数字x在最终序列的位置，![](http://latex.codecogs.com/gif.latex?V%28p%29)为对折后位置p上的数字，则有：
1) 给定同一个x，有![](http://latex.codecogs.com/gif.latex?P%28x%29=V%28x%29)
1) ![](http://latex.codecogs.com/gif.latex?P%28P%28x%29%29=x)
1) ![](http://latex.codecogs.com/gif.latex?V%28V%28x%29%29=x)
1) 如果我们把最终序列重新写在另一张白纸条上的话，又对这张新纸条进行对折操作，最终你又能重新得到原始的自然数序列1，2，3，……，n


#### **头部稳定性**

第t轮对折得到的![](http://latex.codecogs.com/gif.latex?2^{k-t})个堆中，**前面的一半**，即前![](http://latex.codecogs.com/gif.latex?2^{k-t-1})个堆，在下一次第t+1轮对折后保持本堆自身的序列不变。特别地，第一堆的顺序绝对稳定不变。这话有点拗口，但是结果却是很直观的：比如一阶三次对折的最后一个数是8，在第一次对折后它成了第一堆（此时为1，8两个元素）的第二个元素，此后，无论多少次对折，它永远是第二个元素，直到结束。这个结论对下面的推导很重要。


#### 一阶对折的**菊形增长规律**

我们观察从一阶一次至一阶五次的最终序列——


    1 2

    1 4 3 2

    1 8 5 4 3 6 7 2

    1 16 9 8 5 12 13 4 3 14 11 6 7 10 15 2

    1 32 17 16 9 24 25 8 5 28 21 12 13 20 29 4 3 30 19 14 11 22 27 6 7 26 23 10 15 18 31 2

再对这个表稍微整理一下——

    1                                                                                    2      <- k=1

    1                                        4 3                                         2      <- k=2

    1                  8 5                   4 3                   6 7                   2      <- k=3

    1       16 9       8 5       12 13       4 3       14 11       6 7       10 15       2      <- k=4

    1 32 17 16 9 24 25 8 5 28 21 12 13 20 29 4 3 30 19 14 11 22 27 6 7 26 23 10 15 18 31 2      <- k=5

这个排列很有趣，我们至少可以观察到这么几点（当然，这个规律需要数学上的严格证明）：
1) **保序性**：在一阶k次序列在一阶k+1次（以及以后各次）中相对顺序保持不变。
1) **等距分布**：k次序列除去头尾两个数字（即1和2），其他数字以两两为一个单元（以下简称“**块**”，_block_），在高于k次的序列中保持等距。
1) **菊形增长**：k+1次序列总是在k次序列的每两个“**块**”之间插入一个新的“块”，然后这个新的块将成为k+2次序列的“种子”。如果我们将上图的所有数字按等距分布，居中排列的话，这个图从上往下看就犹如一个层层嵌套不断绽放的菊花，因此我称之为“菊形增长”。


#### 块和锚点

下面我们看看从已知的k次序列中的一个数字![](http://latex.codecogs.com/gif.latex?x_k_)及其位置![](http://latex.codecogs.com/gif.latex?P_k_=P%28x{_k_}%29)，如何推导出![](http://latex.codecogs.com/gif.latex?P_{k+1}_)：

    首先，在进行k次折叠时，记数字x所在的“块”的序号为B(x)。
    由于1和2分别位于头尾，这里，定义
        B(1)=0
        B(2)=N
    由于块内元素数目始终不超过2，故
        N=n/2+1-1=n/2，加1是因为头尾块均只有1个元素，减1是因为“块”从0开始编号
    即
        B(2)=2^(k-1)

    那么我们考察B(x)，则B(x)与B(1)之间有B(x)个“空隙”。
    于是当进行k+1次折叠的时候，这些空隙间就可以插入2*B(x)个数。
    所以，在进行k+1次折叠时，数字x所在位置，就是在k次折叠时的位置再加上前面这些插入的数字的个数：
        P(x)=(1+2*(B(x)-1))+2*B(x)+1=4*B(x) ............. (1)
    或
        P(x)=(1+2*(B(x)-1))+2*B(x)+2=4*B(x)+1 ........... (2)
    注意，上面的表达式是带下标的，其中B(x)的下标是k，而P(x)的下标是k+1。

    而对于当前的k次折叠，B(x)与P(x)的关系不难得出：
        P(x)=2*B(x)
    或
        P(x)=2*B(x)+1
    即
        B(x)=P(x)/2，当P(x)为偶数时
    或
        B(x)=(P(x)-1)/2，当P(x)为奇数时
    这里B(x)与P(x)两者下标均为k，且分别对应(1)式和(2)式。

    于是将下标为k的B(x)带入(1)式和(2)式，可得：
        P[k+1](x)=2*P[k](x)，当P(x)为偶数时
    或
        P[k+1](x)=2*P[k](x)-1，当P(x)为奇数时

此时我们就得到了**第一个迭代**：

![](http://latex.codecogs.com/gif.latex?P_{k+1}_%28x%29=\begin{cases}2P_k_%28x%29,&\textrm{P%28x%29%20is%20even}\\\\2P_k_%28x%29-1,&\textrm{P%28x%29%20is%20odd}\end{cases})

这里除了P(1)和P(2)容易得知

![](http://latex.codecogs.com/gif.latex?P%281%29=0)

![](http://latex.codecogs.com/gif.latex?P%282%29=n=2^k)

之外，还有一个比较特殊的点位，即P(n)，通过观察我们似乎能得出

![](http://latex.codecogs.com/gif.latex?P%28n%29=P%282^k%29=2)

根据前面我们总结的“**头部稳定性**”可得知这个结论是正确的。

从此结论出发，可以进一步观察，我们发现**所有2的指幂所在的位置都是“特殊点位”**！

![](http://latex.codecogs.com/gif.latex?P%282^{j}%29=2^{k-j+1},0<j\le%20k)

这些点，我不妨将其称为“**锚点**”（_anchor_）。锚点有这样一些特点：
1) 锚点在它所在的块当中，总是这个块里的两个数字当中排在前面的那个。
1) 除数字1排在第一个以外，其余锚点是按降序排列。
1) 锚点间距是递增的，确切地说，除1以外，排在后面的锚点j（即数字![](http://latex.codecogs.com/gif.latex?2^j)）与排在前面的锚点j+1（即数字![](http://latex.codecogs.com/gif.latex?2^{j+1})）之间间隔了![](http://latex.codecogs.com/gif.latex?2^{k-j}-1)个数字（或者说![](http://latex.codecogs.com/gif.latex?2^{k-j-1}-1)个块）。

在此，我们已经得到了这幅拼图当中的一小块，能够精确计算锚点的位置了。现在我们尝试继续往前迈一步，分析“块”的性质：
1) 首先，容易看出的，除去头尾两个数字，每个块均由一奇一偶两个数字组成，且**偶数总是排在前面**。于是对于任何一个折叠序列，总是奇偶相间排列的。
1) 因此，加上头尾的1和2，我们可以断定：**奇数总是排列在奇数号位置，偶数总是排列在偶数号位置**。
1) 锚点所在的块中，紧跟着锚点j后面的数字是![](http://latex.codecogs.com/gif.latex?2^{j-1}+1)，因此根据上面总结的锚点位置公式，有![](http://latex.codecogs.com/gif.latex?P%282^{j-1}+1%29=2^{k-j+1}+1,0<j\le%20k)，不妨将此点称为“**邻锚点**”。拼图又接上了一小块。

我们通过层层推理，推出了所有锚点和邻锚点的准确位置，那么根据对折的轴对称性质，可以立即推算出比它们大1或小1的相邻数的位置了。这里锚点的镜像位数字比锚点数小1，而邻锚点的镜像位数字比邻锚点大1：

![](http://latex.codecogs.com/gif.latex?P%282^j-1%29=2^k-2^{k-j+1}+1,0<j\le%20k)

![](http://latex.codecogs.com/gif.latex?P%282^{j-1}+2%29=2^k-2^{k-j+1},1<j\le%20k)

补完两块新的拼图。至此，当**k>1**时，我们能够准确推算的点位数有：
* **锚点**：**k+1**个（包括1和2）
* **邻锚点**：**k-1**个（除去1和2这两个数没有邻锚点）
* **锚点的对称位点**：**k-2**个（除去1和2这两个数互为对称，以及中间块的4的对称点恰为邻锚点，不再重复统计）
* **邻锚点的对称位点**：**k-2**个（除去中间块的4，其对称点3恰为邻锚点，不再重复统计）

总共**4k-4**个数。还剩![](http://latex.codecogs.com/gif.latex?2^k-4k+4)个数的位置待确定。

#### 块首倍增

在单独一个序列不容易看出规律的情况下，我们再次来观察两个相邻的序列，看看有什么规律。当然，我们很快就找到了——

    对于k次序列，对于分布在1和2之间的各块，有：对于块i的第一个数字，在k+1次序列中的相同位置处的数字是它的两倍。

给定![](http://latex.codecogs.com/gif.latex?B_{k,i}_)，它的第一个数字（根据上面块的性质第一条，一定是个偶数）是**x**，那么在![](http://latex.codecogs.com/gif.latex?B_{k+1,i}_)中，第一个数字是**2x**，即

![](http://latex.codecogs.com/gif.latex?B_{k+1,i,1}_=2B_{k,i,1}_)

这里我们记块**i**的第一个数字为![](http://latex.codecogs.com/gif.latex?B_{i,1}_)，第二个数字为![](http://latex.codecogs.com/gif.latex?B_{i,2}_)。而对于每个块的第二个数字（奇数）——

    对于k次序列的块i的第二个数字x，在k+1次序列中的相同位置处的数字是2x-1。

即

![](http://latex.codecogs.com/gif.latex?B_{k+1,i,2}_=2B_{k,i,2}_-1)

用值关系表示为，我们得到**第二个迭代**：

![](http://latex.codecogs.com/gif.latex?V_{k+1}_%28x%29=\begin{cases}2V_k_%28x%29,&\textrm{x%20is%20even}\\\\2V_k_%28x%29-1,&\textrm{x%20is%20odd}\end{cases},1<x\le2^k)

观察第一和第二迭代式，似乎长得完全一样啊？不对，其实它们是两个不同的等式。因为第一迭代式的条件是P(x)即**位置序号的奇偶性**；而第二迭代式的条件是**x本身的奇偶性**。但是却可以得出形式完全相同的迭代关系，这也从另一个角度揭示了前面总结过的**对称性**。

如果换算成数字的位置关系，则应该是：

![](http://latex.codecogs.com/gif.latex?\begin{cases}P_{k+1}_%282x%29=P_k_%28x%29,&\textrm{x%20is%20even}\\\\P_{k+1}_%282x-1%29=P_k_%28x%29,&\textrm{x%20is%20odd}\end{cases},1<x\le2^k)

至此，k+1次序列的前一半的所有块的数字，都可以从k次序列完全推出！

而序列的后一半数字呢？我们也观察到了——

    k次序列的后半段数字与前半段有着镜像对应关系。
    偶数在后半段的镜像位数字比该偶数数小1，而奇数在后半段镜像位数字比该奇数大1。

这个性质和前面锚点/邻锚点及其镜像点位的关系完全一致，即

![](http://latex.codecogs.com/gif.latex?M%28x%29=\begin{cases}x-1,&\textrm{x%20is%20even}\\\\x+1,&\textrm{x%20is%20odd}\end{cases},1\le%20P%28x%29\le%202^{k-1})

此处记M(x)为数字x对称位（镜像位）上的数字。转换成位置函数关系就是：

![](http://latex.codecogs.com/gif.latex?P%28M%28x%29%29=2^k-P%28x%29+1,1\le%20P%28x%29\le%202^{k-1})

或

![](http://latex.codecogs.com/gif.latex?\begin{cases}P%28x-1%29=2^k-P%28x%29+1,&\textrm{x is even}\\\\P%28x+1%29=2^k-P%28x%29+1,&\textrm{x is odd}\end{cases},1\le%20P%28x%29\le%202^{k-1})

于是序列的后半段也可以完全构造出来。至此，我们已经可以完全计算整个序列：
1) 确定头尾分别为1和2，即

   ![](http://latex.codecogs.com/gif.latex?P%281%29=1)

   ![](http://latex.codecogs.com/gif.latex?P%282%29=2^k=n)

1) 确定中间块的两个数字分别为4和3，即

   ![](http://latex.codecogs.com/gif.latex?P%283%29=2^{k-1}+1={n\over2}+1)

   ![](http://latex.codecogs.com/gif.latex?P%284%29=2^{k-1}={n\over2})

1) 如何确定一个数是分布在序列的前半段（也称为“左边”）还是后半段（也称为“右边”）呢？这里有个快速的判断方法：

       数字模4余0或余1的，分布在左边；而余2和余3的，则分布在右边。

   知道这个规律以后就可以分别构造前半段和后半段了。

1) 构造序列的前半段（模4余0或余1）：

   ![](http://latex.codecogs.com/gif.latex?P%282^k%29=P%28n%29=2)

   ![](http://latex.codecogs.com/gif.latex?P%282^{k-1}+1%29=P%28{n\over2}+1%29=3)

   ......

   ![](http://latex.codecogs.com/gif.latex?P%282^{j}%29=2^{k-j+1},0<j\le%20k)

   ![](http://latex.codecogs.com/gif.latex?P%282^{j-1}+1%29=2^{k-j+1}+1,0<j\le%20k)

   ......

   ![](http://latex.codecogs.com/gif.latex?P_k_%284i%29=P_{k-1}%282i%29=P_{k-2}_%28i%29,1\le%20i\le%202^{k-2})

   ![](http://latex.codecogs.com/gif.latex?P_k%284i-3%29=P_{k-1}_%282i-1%29=P_{k-2}_%28i%29,1\le%20i\le%202^{k-2})

1) 构造序列的后半段（模4余2或余3）：

   ![](http://latex.codecogs.com/gif.latex?P%282^k-1%29=P%28n-1%29=2^k-1=n-1)

   ![](http://latex.codecogs.com/gif.latex?P%282^{k-1}+2%29=P%28{n\over2}+2%29=2^k-2=n-2)

   ......

   ![](http://latex.codecogs.com/gif.latex?P%282^j-1%29=2^k-2^{k-j+1}+1,0<j\le%20k)

   ![](http://latex.codecogs.com/gif.latex?P%282^{j-1}+2%29=2^k-2^{k-j+1},1<j\le%20k)

   ......

   ![](http://latex.codecogs.com/gif.latex?P_k_%284i-1%29=2^k-P_k_%284i%29+1=2^k-P_{k-2}_%28i%29+1,1\le%20i\le%202^{k-2})

   ![](http://latex.codecogs.com/gif.latex?P_k_%284i-2%29=2^k-P_k_%284i-3%29+1=2^k-P_{k-2}_%28i%29+1,1\le%20i\le%202^{k-2})

根据对称性，求序列位置上的数字的公式也是完全一样的。

最后，必须重申的是：以上我的所有推理都是根据观察和归纳，**并非严格的数学证明**。

## 二阶对折（Second Order Folding）

### 问题

一张正方形的纸，均分成![](http://latex.codecogs.com/gif.latex?n=4^k)格，先按从左到右，然后从上到下顺序在每个格子写下自然数序列1，2，3，……，n

将纸条先从下往上，然后从右往左不断对折（共**k**轮，**2k**步），直至剩下一个格子，求：
1) 最后从下往上数字的序列
1) 数字x（![](http://latex.codecogs.com/gif.latex?1\le%20x\le%20n)）的最终位置
1) 最终序列中位置p的数字

## 算法
目前仅支持最容易设计的“**递归**算法”（_Recursive_）。请参见源代码中各组件的service部分。