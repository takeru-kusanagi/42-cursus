
#ifndef FIXED_HPP
#define FIXED_HPP

class Fixed{
public:
	Fixed();
	Fixed(const Fixed& other);
	Fixed& operator=(const Fixed& other);
	~Fixed();
	int getRawBits(void) const;
	void setRawBits(int const raw);
private:
	int _fixedPointValue;
	static const int _numberOfFractionalBits = 8;
};

#endif
