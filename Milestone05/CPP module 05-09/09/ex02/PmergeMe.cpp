#include "PmergeMe.hpp"

PmergeMe::PmergeMe() : _vecTime(0), _deqTime(0) {}
PmergeMe::~PmergeMe() {}

static size_t getJacobsthal(size_t n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    
    size_t prev2 = 0; 
    size_t prev1 = 1; 
    size_t current = 0;
    
    for (size_t i = 2; i <= n; ++i) {
        current = prev1 + 2 * prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return current;
}

std::vector<int> PmergeMe::fordJohnsonVector(std::vector<int> &v) {
    if (v.size() <= 1) return v;

    int leftover = -1;
    bool hasLeftover = (v.size() % 2 != 0);
    if (hasLeftover) {
        leftover = v.back();
        v.pop_back();
    }

    std::vector<std::pair<int, int> > pairs;
    for (size_t i = 0; i < v.size(); i += 2) {
        if (v[i] > v[i + 1]) 
			pairs.push_back(std::make_pair(v[i], v[i + 1]));
        else 
			pairs.push_back(std::make_pair(v[i + 1], v[i]));
    }

    std::vector<int> largerElements;
    for (size_t i = 0; i < pairs.size(); ++i){
		largerElements.push_back(pairs[i].first);
	}
    largerElements = fordJohnsonVector(largerElements);

    std::vector<int> mainChain = largerElements;
    std::vector<int> pend;
    for (size_t i = 0; i < mainChain.size(); ++i) {
        for (size_t j = 0; j < pairs.size(); ++j) {
            if (mainChain[i] == pairs[j].first) {
                pend.push_back(pairs[j].second);
                break;
            }
        }
    }

    mainChain.insert(mainChain.begin(), pend[0]);

    std::vector<size_t> jacobIdx;
    for (size_t k = 3; ; ++k) {
        size_t j = getJacobsthal(k);
        if (j >= pend.size()) {
            if (jacobIdx.empty() || jacobIdx.back() < pend.size() - 1)
                jacobIdx.push_back(pend.size() - 1);
            break;
        }
        jacobIdx.push_back(j - 1);
    }

    size_t lastPos = 0;
    for (size_t i = 0; i < jacobIdx.size(); ++i) {
        for (size_t j = jacobIdx[i]; j > lastPos; --j) {
            std::vector<int>::iterator it = std::lower_bound(mainChain.begin(), mainChain.end(), pend[j]);
            mainChain.insert(it, pend[j]);
        }
        lastPos = jacobIdx[i];
    }

    if (hasLeftover) {
        mainChain.insert(std::lower_bound(mainChain.begin(), mainChain.end(), leftover), leftover);
    }
    return mainChain;
}

std::deque<int> PmergeMe::fordJohnsonDeque(std::deque<int> &d) {
    if (d.size() <= 1) return d;

    int leftover = -1;
    bool hasLeftover = (d.size() % 2 != 0);
    if (hasLeftover) {
        leftover = d.back();
        d.pop_back();
    }

    std::deque<std::pair<int, int> > pairs;
    for (size_t i = 0; i < d.size(); i += 2) {
        if (d[i] > d[i + 1]) pairs.push_back(std::make_pair(d[i], d[i + 1]));
        else pairs.push_back(std::make_pair(d[i + 1], d[i]));
    }

    std::deque<int> largerElements;
    for (size_t i = 0; i < pairs.size(); ++i) largerElements.push_back(pairs[i].first);
    largerElements = fordJohnsonDeque(largerElements);

    std::deque<int> mainChain = largerElements;
    std::deque<int> pend;
    for (size_t i = 0; i < mainChain.size(); ++i) {
        for (size_t j = 0; j < pairs.size(); ++j) {
            if (mainChain[i] == pairs[j].first) {
                pend.push_back(pairs[j].second);
                break;
            }
        }
    }

    mainChain.push_front(pend[0]);

    for (size_t i = 1; i < pend.size(); ++i) {
        mainChain.insert(std::lower_bound(mainChain.begin(), mainChain.end(), pend[i]), pend[i]);
    }

    if (hasLeftover) {
        mainChain.insert(std::lower_bound(mainChain.begin(), mainChain.end(), leftover), leftover);
    }
    return mainChain;
}

void PmergeMe::run(int ac, char **av) {
    for (int i = 1; i < ac; ++i) {
        std::string s(av[i]);
        if (s.empty() || s.find_first_not_of("0123456789") != std::string::npos)
            throw std::runtime_error("Error: Invalid input");
        long val = std::atol(av[i]);
        if (val < 0 || val > 2147483647)
            throw std::runtime_error("Error: Out of range");
        _vec.push_back(static_cast<int>(val));
        _deq.push_back(static_cast<int>(val));
    }

    std::cout << "Before: ";
    for (size_t i = 0; i < _vec.size(); ++i)
        std::cout << _vec[i] << (i == _vec.size() - 1 ? "" : " ");
    std::cout << std::endl;

    struct timespec start, end;

    clock_gettime(CLOCK_MONOTONIC, &start);
    _vec = fordJohnsonVector(_vec);
    clock_gettime(CLOCK_MONOTONIC, &end);
    _vecTime = (static_cast<double>(end.tv_sec - start.tv_sec) * 1000000.0) + 
               (static_cast<double>(end.tv_nsec - start.tv_nsec) / 1000.0);

    clock_gettime(CLOCK_MONOTONIC, &start);
    _deq = fordJohnsonDeque(_deq);
    clock_gettime(CLOCK_MONOTONIC, &end);
    _deqTime = (static_cast<double>(end.tv_sec - start.tv_sec) * 1000000.0) + 
               (static_cast<double>(end.tv_nsec - start.tv_nsec) / 1000.0);

    std::cout << "After:  ";
    for (size_t i = 0; i < _vec.size(); ++i)
        std::cout << _vec[i] << (i == _vec.size() - 1 ? "" : " ");
    std::cout << std::endl;

    std::cout << "Time to process a range of " << _vec.size() << " elements with std::vector : " << std::fixed << std::setprecision(5) << _vecTime << " us" << std::endl;
    std::cout << "Time to process a range of " << _deq.size() << " elements with std::deque  : " << std::fixed << std::setprecision(5) << _deqTime << " us" << std::endl;
}
