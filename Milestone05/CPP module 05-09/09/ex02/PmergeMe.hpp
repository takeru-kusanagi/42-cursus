
#ifndef PMERGEME_HPP
#define PMERGEME_HPP

#include <iostream>
#include <vector>
#include <deque>
#include <string>
#include <algorithm>
#include <ctime>
#include <sys/time.h>
#include <iomanip>

class PmergeMe
{
public:
	PmergeMe();
	PmergeMe(const PmergeMe &other);
	PmergeMe &operator=(const PmergeMe &other);
	~PmergeMe();

	void run(int ac, char **av);

private:
	std::vector<int> _vec;
	std::deque<int> _deq;
	double _vecTime;
	double _deqTime;

	void sortVector(std::vector<int> &v);
	std::vector<int> fordJohnsonVector(std::vector<int> &v);

	void sortDeque(std::deque<int> &d);
	std::deque<int> fordJohnsonDeque(std::deque<int> &d);
};

#endif
