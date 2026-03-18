package com.SignupForm.repository;

import com.SignupForm.entity.Address;
import com.SignupForm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // This naming convention is powerful—it handles the filtering for you!
    List<Address> findByUserAndDeletedFalse(Users user);
}