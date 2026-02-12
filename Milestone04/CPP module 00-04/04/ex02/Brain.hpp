
#ifndef BRAIN_HPP
#define BRAIN_HPP

#include <string>

class Brain{
public:
	std::string ideas[100];

	Brain();
	Brain(const Brain& other);
	Brain& operator=(const Brain& other);
	virtual ~Brain();

	void setIdea(int index, const std::string& idea);
	const std::string& getIdea(int index) const;
};

#endif
