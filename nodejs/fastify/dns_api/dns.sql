--desc: basic
VALUES QSYS2.HTTP_GET('http://localhost:8088/dns/' CONCAT 'yahoo.com');
    
    
--desc: advanced
select * from JSON_TABLE(QSYS2.HTTP_GET('http://localhost:8088/dns_adv/' CONCAT 
                              'yahoo.com' CONCAT 
                              '?dns_server=8.8.8.8'), 
  '$[*]' 
  COLUMNS ( ADDR VARCHAR(100) PATH 'lax $.address',
            TTL VARCHAR(100) PATH 'lax $.ttl',
            TYPE VARCHAR(100) PATH 'lax $.type') ERROR ON ERROR
  ) X
