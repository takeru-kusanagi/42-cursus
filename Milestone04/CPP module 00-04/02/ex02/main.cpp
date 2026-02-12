
#include "Fixed.hpp"

#include <iostream>

int main( void ) {

	Fixed a;
	Fixed const b( Fixed( 5.05f ) * Fixed( 2 ) );

	std::cout << a << std::endl;
	std::cout << ++a << std::endl;
	std::cout << a << std::endl;
	std::cout << a++ << std::endl;
	std::cout << a << std::endl;

	std::cout << b << std::endl;

	std::cout << Fixed::max( a, b ) << std::endl;

	std::cout << "\n---additional test case---" << std::endl;
    std::cout << "\n--- 1. Comparison Operators ---" << std::endl;
    Fixed c(21.0f);
    Fixed d(10.0f);

    std::cout << "c (" << c << ") > d (" << d << "): " << (c > d ? "True" : "False") << std::endl;
    std::cout << "d < b (" << b << "): " << (d < b ? "True" : "False") << std::endl;
    std::cout << "c >= c: " << (c >= c ? "True" : "False") << std::endl;
    std::cout << "d <= c: " << (d <= c ? "True" : "False") << std::endl;
    std::cout << "c == d: " << (c == d ? "True" : "False") << std::endl;
    std::cout << "c != d: " << (c != d ? "True" : "False") << std::endl;

    std::cout << "\n--- 2. Arithmetic Operators ---" << std::endl;
    Fixed e(2.5f);
    Fixed f(2.0f);

    std::cout << "e + f (2.5 + 2.0): " << e + f << std::endl;
    std::cout << "e - f (2.5 - 2.0): " << e - f << std::endl;
    std::cout << "e * f (2.5 * 2.0): " << e * f << std::endl;
    std::cout << "e / f (2.5 / 2.0): " << e / f << std::endl;

    std::cout << "\n--- 3. Decrement Operators ---" << std::endl;
    Fixed g(1.0f);

    std::cout << "g is: " << g << std::endl;
    std::cout << "--g: " << --g << std::endl;
    std::cout << "g now is: " << g << std::endl;

    std::cout << "g--: " << g-- << std::endl;
    std::cout << "g now is: " << g << std::endl;

    std::cout << "\n--- 4. Min/Max Static ---" << std::endl;
    std::cout << "Min(a, b): " << Fixed::min(a, b) << std::endl;

    Fixed const& c_ref = c;
    Fixed const& d_ref = d;
    std::cout << "Const Min(c, d): " << Fixed::min(c_ref, d_ref) << std::endl;
	std::cout << "\n---additional test end---" << std::endl;

	return 0;
}
