# League-api

## Index

### Functions

* [getFixtures](README.md#getfixtures)
* [isFinished](README.md#isfinished)



---
## Functions
<a id="getfixtures"></a>

### «Const» getFixtures

► **getFixtures**(): `Promise`.<`any`>



*Defined in [league-api.ts:9](https://github.com/swapnilraj/EBeth-daemon/blob/6670bf8/src/league-api.ts#L9)*



Returns an array of upcoming premier league matches.




**Returns:** `Promise`.<`any`>
Array of upcoming premier league matches.






___

<a id="isfinished"></a>

### «Const» isFinished

► **isFinished**(index: *`number`*): `Promise`.<`boolean`>



*Defined in [league-api.ts:25](https://github.com/swapnilraj/EBeth-daemon/blob/6670bf8/src/league-api.ts#L25)*



Returns a boolean signifying if the match is over or not.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| index | `number`   |  The index of the game in the api. |





**Returns:** `Promise`.<`boolean`>
Boolean signifying if the match is over or not.






___

# Daemon

## Index

### Functions

* [daemon](README.md#daemon)



---
## Functions
<a id="daemon"></a>

### «Const» daemon

► **daemon**(): `Promise`.<`void`>



*Defined in [daemon.ts:9](https://github.com/swapnilraj/EBeth-daemon/blob/6670bf8/src/daemon.ts#L9)*



Gets fixtures from the api and deploys them.




**Returns:** `Promise`.<`void`>





___





