
#ifndef CONTACT_HPP
# define CONTACT_HPP

# include <string>

class Contact{
private:
	std::string firstName;
	std::string lastName;
	std::string nickname;
	std::string phoneNumber;
	std::string darkestSecret;

public:
	Contact();
	void setFirstName(const std::string& str);
	void setLastName(const std::string& str);
	void setNickname(const std::string& str);
	void setPhoneNumber(const std::string& str);
	void setDarkestSecret(const std::string& str);
	std::string getFirstName() const;
    std::string getLastName() const;
    std::string getNickname() const;
    std::string getPhoneNumber() const;
    std::string getDarkestSecret() const;
    void displayAllInfo() const;
};

#endif
