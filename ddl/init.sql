create schema CTWallet;

-- todo create user table in the future

create table address
(
    address_id    varchar(255) not null
        primary key,
    description   varchar(255) null,
    user_id       int          null,
    final_balance int          null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);


-- we can add more fields in transaction table
-- metadata as json (longtext in mariadb) may not be a good idea
create table transaction
(
    transaction_id varchar(255)                 not null
        primary key,
    address_id     varchar(255)                 null,
    metadata       longtext collate utf8mb4_bin null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    constraint metadata
        check ()
);
