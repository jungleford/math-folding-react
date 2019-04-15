# math-folding
Research for number folding puzzels

## Install and run

    $ npm install
    $ npm run start

After compiled successfully, then access: http://localhost:8080/

# Background: 对折序列问题（Number Folding Problem）
(Chinese edition)

故事的起因是在一个同学微信群里有大佬抛出一道据说是奥数题，就是下面这个——

![](https://github.com/jungleford/math-folding/raw/master/puzzle.jpg)

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


### 一阶对折的**对称性**

对折前显然是对称，然而经过**k**轮对折后，依然是对称的！记![](http://latex.codecogs.com/gif.latex?P%28x%29)为对折后数字x在最终序列的位置，![](http://latex.codecogs.com/gif.latex?V%28p%29)为对折后位置p上的数字，则有：
1) 给定同一个x，有![](http://latex.codecogs.com/gif.latex?P%28x%29=V%28x%29)
1) ![](http://latex.codecogs.com/gif.latex?P%28P%28x%29%29=x)
1) ![](http://latex.codecogs.com/gif.latex?V%28V%28x%29%29=x)
1) 如果我们把最终序列重新写在另一张白纸条上的话，又对这张新纸条进行对折操作，最终你又能重新得到原始的自然数序列1，2，3，……，n


### **头部稳定性**

第t轮对折得到的![](http://latex.codecogs.com/gif.latex?2^{k-t})个堆中，**前面的一半**，即前![](http://latex.codecogs.com/gif.latex?2^{k-t-1})个堆，在下一次第t+1轮对折后保持本堆自身的序列不变。特别地，第一堆的顺序绝对稳定不变。这话有点拗口，但是结果却是很直观的：比如一阶三次对折的最后一个数是8，在第一次对折后它成了第一堆（此时为1，8两个元素）的第二个元素，此后，无论多少次对折，它永远是第二个元素，直到结束。这个结论对下面的推导很重要。


### 一阶对折的**菊形增长规律**

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


### 块和锚点

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

### 块首倍增

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

![](http://latex.codecogs.com/gif.latex?\begin{cases}P%28x-1%29=2^k-P%28x%29+1,&\textrm{x%20is%20even}\\\\P%28x+1%29=2^k-P%28x%29+1,&\textrm{x%20is%20odd}\end{cases},1\le%20P%28x%29\le%202^{k-1})

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

照旧列个表：

    名称     二阶一次对折  二阶二次对折                                 二阶三次对折

    初始方阵  1 2          1  2  3  4                                 1  2  3  4  5  6  7  8
             3 4          5  6  7  8                                 9 10 11 12 13 14 15 16
                          9 10 11 12                                17 18 19 20 21 22 23 24
                         13 14 15 16                                25 26 27 28 29 30 31 32
                                                                    33 34 35 36 37 38 39 40
                                                                    41 42 43 44 45 46 47 48
                                                                    49 50 51 52 53 54 55 56
                                                                    57 58 59 60 61 62 63 64

    对折轮数   1                2                                              3

    最终序列  1 3 4 2      1 13 16 4 8 12 9 5 6 10 11 7 3 15 14 2    1 57 64 8 32 40 33 25 28 36 37 29 5 61 60 4 12 52 53 13 21 45 44 20 17 41 48 24 16 56 49 9 10 50 55 15 23 47 42 18 19 43 46 22 14 54 51 11 3 59 62 6 30 38 35 27 26 34 39 31 7 63 58 2

### 二阶对折的**对称性**

二阶对折的对称性不太容易直接观察到。我在这里不妨做一个试验。

在前面的一阶对折的对称性当中我曾经谈到过：“**如果我们把最终序列重新写在另一张白纸条上的话，又对这张新纸条进行对折操作，最终你又能重新得到原始的自然数序列**”。那么对于二阶对折，我将最终序列也按照方阵排列的话——

    二阶一次对折
    1 3
    4 2
    
    二阶二次对折
    1 13 16 4
    8 12  9 5
    6 10 11 7
    3 15 14 2
    
    二阶三次对折
     1 57 64  8 32 40 33 25
    28 36 37 29  5 61 60  4
    12 52 53 13 21 45 44 20
    17 41 48 24 16 56 49  9
    10 50 55 15 23 47 42 18
    19 43 46 22 14 54 51 11
     3 59 62  6 30 38 35 27
    26 34 39 31  7 63 58  2
    
    二阶四次对折
     1 241 256 16 128 144 129 113 120 136 137 121  9 249 248  8
    56 200 201 57  73 185 184  72  65 177 192  80 64 208 193 49
    52 196 205 61  77 189 180  68  69 181 188  76 60 204 197 53
     5 245 252 12 124 140 133 117 116 132 141 125 13 253 244  4
    20 228 237 29 109 157 148 100 101 149 156 108 28 236 229 21
    37 213 220 44  92 172 165  85  84 164 173  93 45 221 212 36
    33 209 224 48  96 176 161  81  88 168 169  89 41 217 216 40
    24 232 233 25 105 153 152 104  97 145 160 112 32 240 225 17
    18 226 239 31 111 159 146  98 103 151 154 106 26 234 231 23
    39 215 218 42  90 170 167  87  82 162 175  95 47 223 210 34
    35 211 222 46  94 174 163  83  86 166 171  91 43 219 214 38
    22 230 235 27 107 155 150 102  99 147 158 110 30 238 227 19
     3 243 254 14 126 142 131 115 118 134 139 123 11 251 246  6
    54 198 203 59  75 187 182  70  67 179 190  78 62 206 195 51
    50 194 207 63  79 191 178  66  71 183 186  74 58 202 199 55
     7 247 250 10 122 138 135 119 114 130 143 127 15 255 242  2
    
    二阶五次对折
      1 993 1024  32 512 544 513 481 496 528 529 497  17 1009 1008  16 240  784  785 241 273 753 752 272 257 737 768 288 256  800  769 225
    232 776  793 249 281 761 744 264 265 745 760 280 248  792  777 233   9 1001 1016  24 504 536 521 489 488 520 537 505  25 1017 1000   8
    104 904  921 121 409 633 616 392 393 617 632 408 120  920  905 105 137  873  888 152 376 664 649 361 360 648 665 377 153  889  872 136
    129 865  896 160 384 672 641 353 368 656 657 369 145  881  880 144 112  912  913 113 401 625 624 400 385 609 640 416 128  928  897  97
    100 900  925 125 413 637 612 388 397 621 628 404 116  916  909 109 141  877  884 148 372 660 653 365 356 644 669 381 157  893  868 132
    133 869  892 156 380 668 645 357 364 652 661 373 149  885  876 140 108  908  917 117 405 629 620 396 389 613 636 412 124  924  901 101
      5 997 1020  28 508 540 517 485 492 524 533 501  21 1013 1004  12 236  780  789 245 277 757 748 268 261 741 764 284 252  796  773 229
    228 772  797 253 285 765 740 260 269 749 756 276 244  788  781 237  13 1005 1012  20 500 532 525 493 484 516 541 509  29 1021  996   4
     36 964  989  61 477 573 548 452 461 557 564 468  52  980  973  45 205  813  820 212 308 724 717 301 292 708 733 317 221  829  804 196
    197 805  828 220 316 732 709 293 300 716 725 309 213  821  812 204  44  972  981  53 469 565 556 460 453 549 572 476  60  988  965  37
     69 933  956  92 444 604 581 421 428 588 597 437  85  949  940  76 172  844  853 181 341 693 684 332 325 677 700 348 188  860  837 165
    164 836  861 189 349 701 676 324 333 685 692 340 180  852  845 173  77  941  948  84 436 596 589 429 420 580 605 445  93  957  932  68
     65 929  960  96 448 608 577 417 432 592 593 433  81  945  944  80 176  848  849 177 337 689 688 336 321 673 704 352 192  864  833 161
    168 840  857 185 345 697 680 328 329 681 696 344 184  856  841 169  73  937  952  88 440 600 585 425 424 584 601 441  89  953  936  72
     40 968  985  57 473 569 552 456 457 553 568 472  56  984  969  41 201  809  824 216 312 728 713 297 296 712 729 313 217  825  808 200
    193 801  832 224 320 736 705 289 304 720 721 305 209  817  816 208  48  976  977  49 465 561 560 464 449 545 576 480  64  992  961  33
     34 962  991  63 479 575 546 450 463 559 562 466  50  978  975  47 207  815  818 210 306 722 719 303 290 706 735 319 223  831  802 194
    199 807  826 218 314 730 711 295 298 714 727 311 215  823  810 202  42  970  983  55 471 567 554 458 455 551 570 474  58  986  967  39
     71 935  954  90 442 602 583 423 426 586 599 439  87  951  938  74 170  842  855 183 343 695 682 330 327 679 698 346 186  858  839 167
    162 834  863 191 351 703 674 322 335 687 690 338 178  850  847 175  79  943  946  82 434 594 591 431 418 578 607 447  95  959  930  66
     67 931  958  94 446 606 579 419 430 590 595 435  83  947  942  78 174  846  851 179 339 691 686 334 323 675 702 350 190  862  835 163
    166 838  859 187 347 699 678 326 331 683 694 342 182  854  843 171  75  939  950  86 438 598 587 427 422 582 603 443  91  955  934  70
     38 966  987  59 475 571 550 454 459 555 566 470  54  982  971  43 203  811  822 214 310 726 715 299 294 710 731 315 219  827  806 198
    195 803  830 222 318 734 707 291 302 718 723 307 211  819  814 206  46  974  979  51 467 563 558 462 451 547 574 478  62  990  963  35
      3 995 1022  30 510 542 515 483 494 526 531 499  19 1011 1006  14 238  782  787 243 275 755 750 270 259 739 766 286 254  798  771 227
    230 774  795 251 283 763 742 262 267 747 758 278 246  790  779 235  11 1003 1014  22 502 534 523 491 486 518 539 507  27 1019  998   6
    102 902  923 123 411 635 614 390 395 619 630 406 118  918  907 107 139  875  886 150 374 662 651 363 358 646 667 379 155  891  870 134
    131 867  894 158 382 670 643 355 366 654 659 371 147  883  878 142 110  910  915 115 403 627 622 398 387 611 638 414 126  926  899  99
     98 898  927 127 415 639 610 386 399 623 626 402 114  914  911 111 143  879  882 146 370 658 655 367 354 642 671 383 159  895  866 130
    135 871  890 154 378 666 647 359 362 650 663 375 151  887  874 138 106  906  919 119 407 631 618 394 391 615 634 410 122  922  903 103
      7 999 1018  26 506 538 519 487 490 522 535 503  23 1015 1002  10 234  778  791 247 279 759 746 266 263 743 762 282 250  794  775 231
    226 770  799 255 287 767 738 258 271 751 754 274 242  786  783 239  15 1007 1010  18 498 530 527 495 482 514 543 511  31 1023  994   2

在此我将这个方阵称为“**同阶结果方阵**”（_Equi-order Result Matrix_）或者“**结果方阵**”。那么对这样一个方阵也按对折方式操作，是否最后也能够回到初始方阵呢？如果我把从开始的方阵进行对折操作得到最终的一维序列称为“一**局**”（_Round_）的话，需要对少**局**这样的对折才能回到初始方阵呢？

    二阶一次对折（2局）
    1 3  ->  1 4  ->  1 2
    4 2      2 3      3 4

    二阶二次对折（3局）
    1 13 16 4     1  3  2  4    1 16 13 4    1  2  3  4
    8 12  9 5 ->  5  7  6  8 -> 8  9 12 5 -> 5  6  7  8
    6 10 11 7    12 10 11  9    7 10 11 6    9 10 11 12
    3 15 14 2    16 14 15 13    2 15 14 3   13 14 15 16

二阶三次对折稍微复杂一些，亦可以自行检验，在最初的几局过后似乎都无法回归到初始方阵，但是，如果你有足够的耐心的话，可以验证到**第27局**的时候终于能够恢复到初始方阵了！（源代码附带一个 Test Panel 的标签页来展示这个反复对折的过程）。

从一次对折的2局还原，到二次对折是3局即可还原，然而三次对折突然有了一个比较大幅度的跨越，需要27局才能还原。四次及以上对折是否依旧可以还原到初始方阵呢？猜想似乎可以，并且猜想需要大得多的局数才能完成，但目前我还无法证明这个结论的真伪。

### 头部稳定

二阶对折过程同样服从头部稳定规律，但是这需要是以“**轮**”为一个计数单位。

### 锚点

还是按照在推演一阶对折的公式中曾经用到过的思路：**找特殊点位**。

首先我们能找到三个比较明显点位：数字1，数字2和最后一个数字![](http://latex.codecogs.com/gif.latex?4^k)
 * （结论1）1仍然是第一个数字
 * （结论1）2是最后一个数字，即![](http://latex.codecogs.com/gif.latex?4^k)号位
 * （结论3）![](http://latex.codecogs.com/gif.latex?4^k)位于3号位

转换成方阵的话：
 * （结论1'）1位于左上角
 * （结论2'）2位于右下角，也就是1的对角位置
 * （结论3'）![](http://latex.codecogs.com/gif.latex?4^k)位于顶边的第3个位置，也就是和数字1隔了一个数字。当k=1时例外，4位于左下角，因为此时数字太少，仅有4个。

然后，紧跟着![](http://latex.codecogs.com/gif.latex?4^k)的两个数字，也就是第4个和第5个数字也很特别：
 * （结论4）第4个数字是n的平方根，也就是![](http://latex.codecogs.com/gif.latex?2^k)
 * （结论5）第5个数字是n的一半![](http://latex.codecogs.com/gif.latex?n\over2)，也就是![](http://latex.codecogs.com/gif.latex?2^{2k-1})

还有：
 * （结论6）除2以外的2的各幂次皆位于结果方阵的上半部分。这点和一阶对折的情形很相似。

数字4及其偶数倍数（8，16……等）似乎也很特别：
 * （结论7）从**二次对折**开始，数字**4**总是位于结果方阵最右边，且在这一边的位置呈2的幂次数变化，也就是说，4是最右边的第![](http://latex.codecogs.com/gif.latex?2^{k-2})个数，换算成一维结果，则是第![](http://latex.codecogs.com/gif.latex?4^{k-1})个数。
 * （结论8）从**四次对折**开始，数字**8**总是位于结果方阵最右边，且在这一边的位置呈2的幂次数变化，也就是说，4是最右边的第![](http://latex.codecogs.com/gif.latex?2^{k-4})个数，换算成一维结果，则是第![](http://latex.codecogs.com/gif.latex?4^{k-2})个数。
 * ……

### 中心对称与孪生点

我们把初始自然数序列按两两为一组，就像这样：(1,2) (3,4) (5,6) ... (![](http://latex.codecogs.com/gif.latex?4^k-1), ![](http://latex.codecogs.com/gif.latex?4^k))

然后观察这些数字对在**结果方阵**中的位置，我们很快就发现一个有趣的现象：这些数对中的每一对数字，在结果方阵里都呈现“**中心对称**”分布！也就是说，如果我们把对称中心定在这个结果方阵的正中心位置，那么我们挑选的一对数字正是以此为中心的对称。不信你可以在上面给出的一次到五次结果方阵中验证。比如任意次数的结果方阵中，1和2分别位于左上和右下两对角位；二阶三次结果方阵中，3位于第7行（倒数第2行）第1列，而4位于第2行第8列；二阶四次结果方阵，100在第5行第8列，而第12行（倒数第5行）第9列正是数字99。

这里我就将这样一对数称为“**孪生数**”或者“**孪生点**”。

在结果方阵中的中心对称意味着什么呢？意味着我们把结果方阵重新还原成**结果序列**的话，那么孪生点在结果序列中是沿中心轴对称（当然也是中心对称，因为序列是一维的）。

![](http://latex.codecogs.com/gif.latex?\begin{cases}P%28x-1%29=4^k-P%28x%29+1,&\textrm{x%20is%20even}\\\\P%28x+1%29=4^k-P%28x%29+1,&\textrm{x%20is%20odd}\end{cases})

![](http://latex.codecogs.com/gif.latex?\begin{cases}V%28x%29=V%284^k-x+1%29+1,&\textrm{V%28x%29%20is%20even}\\\\V%28x%29=V%284^k-x+1%29-1,&\textrm{V%28x%29%20is%20odd}\end{cases})

中心对称规律的发现，立即将推算的点位数减少了一半，这显然是非常给力的。（当然，仍然只是我的观察结果，并非数学证明）

### 分布规律

我们以**中位数**![](http://latex.codecogs.com/gif.latex?n\over2)（即![](http://latex.codecogs.com/gif.latex?2^{2k-1})）为参考点，将这n个数分为前后两部分：“**高位数**”（_Upper Numbers_，大于![](http://latex.codecogs.com/gif.latex?n\over2)）和“**低位数**”（_Lower Numbers_，小于或等于![](http://latex.codecogs.com/gif.latex?n\over2)）。

再观察结果方阵中的每一行，我们发现：
 * （结论9）二次及以上各次对折的结果方阵中，中位数![](http://latex.codecogs.com/gif.latex?n\over2)位于方阵的上半部分。这个由**结论5**可知。
 * （结论10）在任意一行中，高位数和低位数总是各占一半。
 * （结论11）在行与行之间，高位数与低位数总是以两个为一组（头尾除外，它们分别只有一个数，并且皆为低位数）间隔着排列。

结论11可以用下图来表示——

![](https://github.com/jungleford/math-folding/raw/master/fig1.jpg)

在这里我沿用在一阶对折的推导过程中使用过的概念，也将每个方框内的那些数定义为一个“**块**”（_Block_）。块的分布规律让我们定位范围又缩小了一些。

## 算法
目前仅支持最容易设计的“**递归算法**”（_Recursive_）一阶对折还额外支持“**迭代公式算法**”（_Formula_）。请参见源代码中各组件的service部分。