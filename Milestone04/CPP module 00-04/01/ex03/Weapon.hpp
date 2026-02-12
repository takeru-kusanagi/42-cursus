
#ifndef WEAPON_HPP
#define WEAPON_HPP

#include <string>

class Weapon{
public:
	Weapon(std::string type);

	const std::string& getType() const;
	void setType(std::string newType);

private:
	std::string _type;
};

#endif
