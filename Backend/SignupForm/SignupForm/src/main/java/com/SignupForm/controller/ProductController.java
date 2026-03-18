package com.SignupForm.controller;

import com.SignupForm.dto.product.ProductRequest;
import com.SignupForm.entity.Product;
import com.SignupForm.entity.CarbonData;
import com.SignupForm.entity.CarbonBreakdown;
import com.SignupForm.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductRepository productRepo;

    public ProductController(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    @GetMapping("/products")
    public List<Product> getAll() {
        return productRepo.findAll();
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return productRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products/search")
    public List<Product> search(@RequestParam String keyword) {
        return productRepo.findByNameContainingIgnoreCase(keyword);
    }

    @PostMapping("/product")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> create(@RequestBody ProductRequest dto) {
        Product product = mapToEntity(new Product(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(productRepo.save(product));
    }

    @PutMapping("/product/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody ProductRequest dto) {
        return productRepo.findById(id).map(existingProduct -> {
            Product updatedProduct = mapToEntity(existingProduct, dto);
            return ResponseEntity.ok(productRepo.save(updatedProduct));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/product/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Maps the flat DTO from React to the nested Entity structure for Hibernate.
     */
    private Product mapToEntity(Product product, ProductRequest dto) {
        // Basic Product Info
        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setSeller(dto.getSeller());
        product.setPrice(round(dto.getPrice()));
        product.setImage(dto.getImage());
        product.setDescription(dto.getDescription());
        product.setIsEcoFriendly(dto.getIsEcoFriendly());

        // Carbon Breakdown Nesting
        CarbonBreakdown br = new CarbonBreakdown();
        double m = round(dto.getManufacturing());
        double p = round(dto.getPackaging());
        double t = round(dto.getTransport());
        double h = round(dto.getHandling());

        br.setManufacturing(m);
        br.setPackaging(p);
        br.setTransport(t);
        br.setHandling(h);

        // Carbon Data Wrapper
        CarbonData cd = new CarbonData();
        cd.setBreakdown(br);
        cd.setMaterial("Standard"); // Default material

        // Total CO2 Calculation Logic
        if (dto.getTotalCO2e() != null && dto.getTotalCO2e() > 0) {
            cd.setTotalCO2ePerKg(round(dto.getTotalCO2e()));
            cd.setMethod("manual");
        } else {
            cd.setTotalCO2ePerKg(round(m + p + t + h));
            cd.setMethod("automatic");
        }

        product.setCarbonData(cd);

        // Ensure top-level emission field is synced with total
        product.setEmission(cd.getTotalCO2ePerKg());

        return product;
    }

    private Double round(Double value) {
        if (value == null) return 0.0;
        return Math.round(value * 100.0) / 100.0;
    }
}