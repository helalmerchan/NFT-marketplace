// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; 

contract NFTSTORE is ERC721URIStorage {
    address payable public marketplaceOwner; // marketplace owner
    uint256 public listingFeePercent = 20; // listing fee percent
    uint256 public currentTokenId; // current token id
    uint256 public totalItemSold; // total item sold

    // NFT listing struct 
    struct NFTListing {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;        
    }

    mapping (uint256 => NFTListing) private tokenIdToListing; // store NFT listing

    // modifier onlyOwner
    modifier onlyOwner {
        require(msg.sender == marketplaceOwner, "Only owner can call this function");
        _;
    }

    // constructor with payable marketplace owner
    constructor() ERC721("NFTMP", "NFTMP") {
        marketplaceOwner = payable(msg.sender); // set marketplace owner
    }

    // update listing fee percent
    function updateListingFeePercent(uint256 _listingFeePercent) public onlyOwner {
        listingFeePercent = _listingFeePercent; // update listing fee percent
    }

    // get listing fee percent 
    function getListingFeePercent() public view returns (uint256) {
        return listingFeePercent; // return listing fee percent
    }

    // get current token id 
    function getCurrentTokenId() public view returns(uint256) {
        return currentTokenId; // return current token id
    }

    // store NFT listing
    function getNFTListing(uint256 _tokenId) public view returns(NFTListing memory) {
        return tokenIdToListing[_tokenId]; // return NFT listing
    }

    // create token 
    function createToken(string memory _tokenURI, uint256 _price) public returns(uint256) {
        require(_price > 0, "Price must be greater than zero");

        currentTokenId++; // increment current token id
        uint256 newTokenId = currentTokenId; // new token id
        _safeMint(msg.sender, newTokenId); // mint new token
        _setTokenURI(newTokenId, _tokenURI); // set token URI

        _createNFTListing(newTokenId, _price); // create NFT listing

        return newTokenId; // return new token id
    }

    // create NFT listing with payable
    function _createNFTListing(uint256 _tokenId, uint256 _price) private {
        tokenIdToListing[_tokenId] = NFTListing({
            tokenId: _tokenId,
            owner: payable(msg.sender),
            seller: payable(msg.sender),
            price: _price
        }); 
    }

    // execute sale with payable 
    function executeSale(uint256 tokenId) public payable {
        NFTListing storage listing = tokenIdToListing[tokenId]; // get NFT listing

        uint256 price = listing.price; // get price
        address payable seller = listing.seller; // get seller

        require(msg.value == price, "Please pay asking price to buy NFT"); // check price

        listing.seller = payable(msg.sender); // update seller
        totalItemSold++; // increment total item sold

        _transfer(listing.owner, msg.sender, tokenId); // transfer NFT to buyer

        uint256 listingFee = (price * listingFeePercent) / 100; // calculate listing fee

        marketplaceOwner.transfer(listingFee); // transfer listing fee to marketplace owner

        seller.transfer(msg.value - listingFee); // transfer remaining balance to seller
    }

    // get all listed NFTs
    function getAllListedNFTs() public view returns (NFTListing[] memory) {
        uint256 totalNFTCount = currentTokenId; // get total NFT count
        NFTListing[] memory listedNFTs = new NFTListing[](totalNFTCount); // create NFT listing array

        uint256 cuccentIndex = 0;

        for (uint256 i = 0; i < totalNFTCount; i++) {
            uint256 tokenId = i + 1; // get token id
            NFTListing storage listing = tokenIdToListing[tokenId]; // get NFT listing

            listedNFTs[cuccentIndex] = listing; // add NFT listing to array
            cuccentIndex += 1; // increment cuccent index
        }
        return listedNFTs;
    }

    function getMyNFTs() public view returns (NFTListing[] memory) {
        uint256 totalNFTCount = currentTokenId; // get total NFT count
        uint256 myNFTCount = 0; // create my NFT count
        uint256 cuccentIndex = 0; // create cuccent index

        for(uint256 i = 0; i < totalNFTCount; i++) {
           if(tokenIdToListing[i+1].owner == msg.sender || tokenIdToListing[i+1].seller == msg.sender) {
               myNFTCount++;
           }
        }

        NFTListing[] memory myNFTs = new NFTListing[](myNFTCount); // create my NFT array

        for(uint256 i = 0; i < totalNFTCount; i++) {
            if(tokenIdToListing[i+1].owner == msg.sender || tokenIdToListing[i+1].seller == msg.sender) {
               uint256 tokenId = i + 1; // get token id
               NFTListing storage listing = tokenIdToListing[tokenId]; // get NFT listing

               myNFTs[cuccentIndex] = listing; // add NFT listing to array
               cuccentIndex ++; // increment cuccent index
            }
        }
        return myNFTs;

    }
}

<!-- npx hardhat ignition deploy ./ignition/modules/Token.js --network holesky -->
<!-- TokenModule#NFTSTORE - 0x7dBfD2336DAA660c3b024c4BAd25EcBfFaa084eC -->